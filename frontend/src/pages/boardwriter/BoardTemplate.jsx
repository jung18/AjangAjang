import React, { useState } from 'react';
import styles from './BoardTemplate.module.css'; // CSS 파일 import
import apiClient from '../../api/apiClient'; // apiClient import

const BoardTemplate = () => {
    // 상태 관리
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [usagePeriod, setUsagePeriod] = useState('');
    const [itemCondition, setItemCondition] = useState('');
    const [months, setMonths] = useState('');
    const [gender, setGender] = useState('');
    const [templateResult, setTemplateResult] = useState('');
    const [tone, setTone] = useState('차분한'); // tone 상태 추가

    // 핸들러 함수
    const handleProductNameChange = (e) => setProductName(e.target.value);
    const handlePriceChange = (e) => setPrice(e.target.value);
    const handleUsagePeriodChange = (e) => setUsagePeriod(e.target.value);
    const handleItemConditionChange = (e) => setItemCondition(e.target.value);
    const handleMonthsChange = (e) => setMonths(e.target.value);
    const handleGenderChange = (e) => setGender(e.target.value);
    const handleToneChange = (e) => setTone(e.target.value); // tone 핸들러 추가

    const handleCreateTemplate = async () => {
        // 생성 버튼 클릭 시 로직
        const templateData = {
            item: productName,
            price: price,
            usagePeriod: usagePeriod,
            itemCondition: itemCondition,
            tone: tone, // tone 값 설정
        };
        console.log('생성된 템플릿 데이터:', templateData);
        try {
            const response = await apiClient.post('/api/claude', {
                ...templateData
            });
            console.log('서버 응답:', response.data);
            setTemplateResult(response.data.content); // 서버에서 받은 결과를 상태에 저장
        } catch (error) {
            console.error('Error creating template:', error);
        }
    };

    const handleUseTemplate = () => {
        // 사용 버튼 클릭 시 로직
        const templateData = {
            item: productName,
            price: price,
            usagePeriod: usagePeriod,
            itemCondition: itemCondition,
            tone: tone, // tone 값 포함
        };
        console.log('사용할 템플릿 데이터:', templateData);
        // 여기에서 템플릿 데이터를 다른 컴포넌트로 전달하거나 사용할 수 있습니다.
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.title}>상품 정보</div>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        placeholder="상품명"
                        className={styles.inputField}
                        value={productName}
                        onChange={handleProductNameChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="text" 
                        placeholder="가격"
                        className={styles.inputField} 
                        value={price}
                        onChange={handlePriceChange}
                    />
                    <select className={styles.selectField} value={usagePeriod} onChange={handleUsagePeriodChange}>
                        <option value="">사용 기간</option>
                        <option value="1년">1년</option>
                        <option value="2년">2년</option>
                        <option value="3년">3년</option>
                        <option value="4년">4년</option>  
                        <option value="5년 이상">5년 이상</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="text" 
                        placeholder="상태"
                        className={styles.inputField} 
                        value={itemCondition}
                        onChange={handleItemConditionChange}
                    />
                </div>
                <div className={styles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="tone"
                            value="차분한"
                            checked={tone === '차분한'}
                            onChange={handleToneChange}
                        />
                        차분한 톤
                        <input
                            type="radio"
                            name="tone"
                            value="친근한 톤"
                            checked={tone === '친근한 톤'}
                            onChange={handleToneChange}
                        />
                        친근한 톤
                        <input
                            type="radio"
                            name="tone"
                            value="아이같은 톤"
                            checked={tone === '아이같은 톤'}
                            onChange={handleToneChange}
                        />
                        아이같은 톤
                    </label>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.title}>아이 정보</div>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        placeholder="개월 수"
                        className={styles.inputField}
                        value={months}
                        onChange={handleMonthsChange}
                    />
                    <span>성별</span>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="남"
                            checked={gender === '남'}
                            onChange={handleGenderChange}
                        />
                        남
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="여"
                            checked={gender === '여'}
                            onChange={handleGenderChange}
                        />
                        여
                    </label>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.title}>생성 결과</div>
                <div className={styles.result}>
                    <div className={styles.resultBox}>
                        {templateResult ? templateResult : '템플릿 생성 결과가 보여집니다.'}
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.createButton} onClick={handleCreateTemplate}>생성</button>
                    <button className={styles.createButton} onClick={handleUseTemplate}>사용</button>
                </div>
            </div>
        </div>
    );
};

export default BoardTemplate;
