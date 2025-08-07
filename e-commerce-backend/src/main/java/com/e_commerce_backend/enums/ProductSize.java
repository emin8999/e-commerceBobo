package com.e_commerce_backend.enums;

public enum ProductSize {

    TWO_XS("2XS"),
    XS("XS"),
    S("S"),
    M("M"),
    L("L"),
    XL("XL"),
    TWO_XL("2XL");

    private final String label;

    ProductSize(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
