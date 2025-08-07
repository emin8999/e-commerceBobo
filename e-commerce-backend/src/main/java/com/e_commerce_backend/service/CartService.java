package com.e_commerce_backend.service;

import com.e_commerce_backend.dto.requestdto.cart.AddToCartRequestDto;
import com.e_commerce_backend.dto.requestdto.cart.UpdateCartItemQuantityRequestDto;
import com.e_commerce_backend.dto.responseDto.cart.CartResponseDto;
import com.e_commerce_backend.dto.responseDto.cart.CartSummaryDto;

import java.util.List;

public interface CartService {

    CartResponseDto addToCart(AddToCartRequestDto addToCartRequestDto);

    List<CartResponseDto> getCartItems();

    CartSummaryDto getCartSummary();

    CartResponseDto updateCartItemQuantity(Long cartItemId, UpdateCartItemQuantityRequestDto requestDto);

    CartResponseDto getCartItem(Long cartItemId);

    void removeFromCart(Long cartItemId);

    void removeProductFromCart(Long productId);

    void clearCart();

    boolean isProductInCart(Long productId);

    int getCartItemsCount();

    CartResponseDto moveToWishlist(Long cartItemId);

    void validateCartBeforeCheckout();

    void syncCartWithCurrentPrices();

}
