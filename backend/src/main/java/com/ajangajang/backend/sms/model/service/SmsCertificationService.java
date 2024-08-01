package com.ajangajang.backend.sms.model.service;

import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.sms.model.dto.SmsCertificationDto;
import com.ajangajang.backend.sms.model.repository.SmsCertificationRepository;
import com.ajangajang.backend.sms.util.SmsCertificationUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SmsCertificationService {

    private final SmsCertificationUtil smsCertificationUtil;
    private final SmsCertificationRepository smsCertificationRepository;

    public void sendSms(SmsCertificationDto smsCertificationDto){
        String to = smsCertificationDto.getPhone();
        int randomNumber = (int) (Math.random() * 900000) + 100000;
        String certificationNumber = String.valueOf(randomNumber);
        smsCertificationUtil.sendSms(to, certificationNumber);
        smsCertificationRepository.createSmsCertification(to,certificationNumber);
    }

    public void verifySms(SmsCertificationDto smsCertificationDto) {
        if (!isVerify(smsCertificationDto)) {
            throw new CustomGlobalException(CustomStatusCode.SMS_CERTIFICATION_FAIL);
        }
        smsCertificationRepository.deleteSmsCertification(smsCertificationDto.getPhone());
    }

    public boolean isVerify(SmsCertificationDto smsCertificationDto) {
        return smsCertificationRepository.existsSmsCertification(smsCertificationDto.getPhone()) &&
                smsCertificationRepository.getSmsCertification(smsCertificationDto.getPhone())
                        .equals(smsCertificationDto.getCertificationNumber());
    }
}
