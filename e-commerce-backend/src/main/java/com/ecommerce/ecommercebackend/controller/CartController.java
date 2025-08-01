package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.dto.request.cart.AddToCartRequestDto;
import com.ecommerce.ecommercebackend.dto.request.cart.UpdateCartItemQuantityRequestDto;
import com.ecommerce.ecommercebackend.dto.response.cart.CartResponseDto;
import com.ecommerce.ecommercebackend.dto.response.cart.CartSummaryDto;
import com.ecommerce.ecommercebackend.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cart")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Cart Management", description = "Cart operations for authenticated users")
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Add product to cart", description = "Add a product to the user's cart")
    @ApiResponse(responseCode = "200", description = "Product added to cart successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @PostMapping("/add")
    public ResponseEntity<CartResponseDto> addToCart(@RequestBody @Valid AddToCartRequestDto addToCartRequestDto) {
        log.info("Adding product {} to cart", addToCartRequestDto.getProductId());
        CartResponseDto response = cartService.addToCart(addToCartRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get cart items", description = "Retrieve all items in the user's cart")
    @GetMapping("/items")
    public ResponseEntity<List<CartResponseDto>> getCartItems() {
        List<CartResponseDto> cartItems = cartService.getCartItems();
        return ResponseEntity.ok(cartItems);
    }

    @Operation(summary = "Get cart summary", description = "Get cart summary with totals")
    @GetMapping("/summary")
    public ResponseEntity<CartSummaryDto> getCartSummary() {
        CartSummaryDto summary = cartService.getCartSummary();
        return ResponseEntity.ok(summary);
    }

    @Operation(summary = "Get cart item", description = "Get specific cart item details")
    @GetMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponseDto> getCartItem(
        @Parameter(description = "Cart item ID") @PathVariable Long cartItemId) {
        CartResponseDto cartItem = cartService.getCartItem(cartItemId);
        return ResponseEntity.ok(cartItem);
    }

    @Operation(summary = "Update cart item quantity", description = "Update the quantity of a cart item")
    @PutMapping("/items/{cartItemId}/quantity")
    public ResponseEntity<CartResponseDto> updateQuantity(
        @Parameter(description = "Cart item ID") @PathVariable Long cartItemId,
        @RequestBody @Valid UpdateCartItemQuantityRequestDto requestDto) {
        CartResponseDto response = cartService.updateCartItemQuantity(cartItemId, requestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Remove item from cart", description = "Remove a specific item from cart")
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(
        @Parameter(description = "Cart item ID") @PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Remove product from cart", description = "Remove all instances of a product from cart")
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> removeProductFromCart(
        @Parameter(description = "Product ID") @PathVariable Long productId) {
        cartService.removeProductFromCart(productId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Clear cart", description = "Remove all items from cart")
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Check if product in cart", description = "Check if a product is already in cart")
    @GetMapping("/products/{productId}/exists")
    public ResponseEntity<Map<String, Boolean>> isProductInCart(
        @Parameter(description = "Product ID") @PathVariable Long productId) {
        boolean exists = cartService.isProductInCart(productId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @Operation(summary = "Get cart items count", description = "Get total number of items in cart")
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getCartItemsCount() {
        int count = cartService.getCartItemsCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @Operation(summary = "Validate cart", description = "Validate cart before checkout")
    @PostMapping("/validate")
    public ResponseEntity<Map<String, String>> validateCart() {
        cartService.validateCartBeforeCheckout();
        return ResponseEntity.ok(Map.of("status", "valid"));
    }

    @Operation(summary = "Sync cart prices", description = "Sync cart with current product prices")
    @PostMapping("/sync-prices")
    public ResponseEntity<Map<String, String>> syncCartPrices() {
        cartService.syncCartWithCurrentPrices();
        return ResponseEntity.ok(Map.of("status", "synced"));
    }
}