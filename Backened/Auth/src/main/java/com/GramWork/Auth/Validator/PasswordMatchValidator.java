package com.GramWork.Auth.Validator;

import com.GramWork.Auth.DTO.RegisterRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, RegisterRequest> {

    @Override
    public boolean isValid(RegisterRequest value, ConstraintValidatorContext context) {
        return value.getPassword()!=null
                && value.getPassword().equals(value.getConfirmPassword());
    }
}
