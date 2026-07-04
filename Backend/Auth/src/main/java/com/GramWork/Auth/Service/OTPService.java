package com.GramWork.Auth.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final EmailService emailService;
    private final StringRedisTemplate stringRedisTemplate;


    public String generateOTP() {
        return String.valueOf(100000 + new SecureRandom().nextInt(900000));
    }

    public void sendOTPbyEmail(String email) {
        String otpKey = "otp:" + email;
        String rateKey = "rate:" + email;
        String coolDownKey = "coolDown:" + email;
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(coolDownKey))) {
            throw new RuntimeException("Please wait 60 seconds before requesting another OTP.");
        }

        Long count = stringRedisTemplate.opsForValue().increment(rateKey);
        if (count != null && count == 1) {
            stringRedisTemplate.expire(rateKey, Duration.ofHours(1));
        }
        if (count != null && count > 5) {
            throw new RuntimeException("Too many OTP requests. Try again later.");
        }


        String otp = generateOTP();


        stringRedisTemplate.opsForValue().set(otpKey, otp, Duration.ofMinutes(10));

        stringRedisTemplate.opsForValue().set(coolDownKey, "1", Duration.ofSeconds(60));


        String subject = "Your GramWork Verification Code: " + otp;
        String message = "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">" +
                "<div style=\"margin:50px auto;width:70%;padding:20px 0\">" +
                "<div style=\"border-bottom:1px solid #eee\">" +
                "<a href=\"\" style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">GramWork</a>" +
                "</div>" +
                "<p style=\"font-size:1.1em\">Hi,</p>" +
                "<p>Thank you for choosing GramWork. Use the following OTP to complete your Sign Up procedures. OTP is valid for 10 minutes.</p>" +
                "<h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">" + otp + "</h2>" +
                "<p style=\"font-size:0.9em;\">Regards,<br />GramWork</p>" +
                "<hr style=\"border:none;border-top:1px solid #eee\" />" +
                "<div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">" +
                "<p>GramWork Inc</p>" +
                "<p>Your Address</p>" +
                "</div>" +
                "</div>" +
                "</div>";


        emailService.sendEmail(email, subject, message);
    }
    public void verifyOTPbyEmail(String email,String otp) {
        String otpKey = "otp:" + email;
        String attemptKey="attempt:"+email;
        String storedOtp=stringRedisTemplate.opsForValue().get(otpKey);
        
        if(storedOtp==null){
            throw new RuntimeException("OTP expired");
        }

        if (otp == null || otp.trim().isEmpty()) {
            throw new RuntimeException("OTP is missing or empty");
        }
        
        if(!storedOtp.equals(otp.trim())){
            Long attempt=stringRedisTemplate.opsForValue().increment(attemptKey);
            if(attempt!=null && attempt==1){
                stringRedisTemplate.expire(attemptKey,Duration.ofMinutes(10));
            }
            if(attempt!=null && attempt>=5){
                throw new RuntimeException("Too many OTP requests. try again after 10 minutes.");
            }
            throw new RuntimeException("Invalid OTP");
        }
        stringRedisTemplate.delete(otpKey);
        stringRedisTemplate.delete(attemptKey);
    }
    public void sendOTPbyEmailForReset(String email) {
        String otpKey = "otp:" + email;
        String rateKey = "rate:" + email;
        String coolDownKey = "coolDown:" + email;
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(coolDownKey))) {
            throw new RuntimeException("Please wait 60 seconds before requesting another OTP.");
        }

        Long count = stringRedisTemplate.opsForValue().increment(rateKey);
        if (count != null && count == 1) {
            stringRedisTemplate.expire(rateKey, Duration.ofHours(1));
        }
        if (count != null && count > 5) {
            throw new RuntimeException("Too many OTP requests. Try again later.");
        }


        String otp = generateOTP();


        stringRedisTemplate.opsForValue().set(otpKey, otp, Duration.ofMinutes(10));

        stringRedisTemplate.opsForValue().set(coolDownKey, "1", Duration.ofSeconds(60));


        String subject = "GramWork Password Reset Verification Code";
        String message = "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">" +
                "<div style=\"margin:50px auto;width:70%;padding:20px 0\">" +
                "<div style=\"border-bottom:1px solid #eee\">" +
                "<a href=\"\" style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">GramWork</a>" +
                "</div>" +
                "<p style=\"font-size:1.1em\">Hi,</p>" +
                "<p>We received a request to reset your password for your GramWork account. Use the following OTP to complete the password reset procedure. This OTP is valid for 10 minutes.</p>" +
                "<h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">" + otp + "</h2>" +
                "<p style=\"font-size:0.9em;\">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>" +
                "<p style=\"font-size:0.9em;\">Regards,<br />GramWork</p>" +
                "<hr style=\"border:none;border-top:1px solid #eee\" />" +
                "<div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">" +
                "<p>GramWork Inc</p>" +
                "<p>Your Address</p>" +
                "</div>" +
                "</div>" +
                "</div>";


        emailService.sendEmail(email, subject, message);
    }
}