document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

    const uploadSection = document.getElementById('uploadSection');
    const optionsSection = document.getElementById('optionsSection');
    const triggerImageUpload = document.getElementById('triggerImageUpload');
    const imageUploadInput = document.getElementById('imageUploadInput');
    const uploadedFileName = document.getElementById('uploadedFileName');

    const triggerImageUploadAfter = document.getElementById('triggerImageUploadAfter');
    const imageUploadInputAfter = document.getElementById('imageUploadInputAfter');
    const uploadedFileNameAfter = document.getElementById('uploadedFileNameAfter');
    const imagePreviewAfter = document.getElementById('imagePreviewAfter');

    const addRequirementBtn = document.getElementById('addRequirementBtn');
    const additionalReqFields = document.getElementById('additionalReqFields');
    const generateImageBtn = document.getElementById('generateImageBtn');

    let uploadedImageFile = null; // 업로드된 이미지 파일 객체 저장

    // 사이드바 토글 기능
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        // 버튼 자체는 고정되므로 따로 이동 로직 없음
    });

    // 이미지 첨부 버튼 (초기 화면) 클릭 시 파일 입력 열기
    triggerImageUpload.addEventListener('click', () => {
        imageUploadInput.click();
    });

    // 이미지 첨부 버튼 (옵션 화면) 클릭 시 파일 입력 열기
    triggerImageUploadAfter.addEventListener('click', () => {
        imageUploadInputAfter.click();
    });

    // 파일 선택 시 처리 (초기 화면)
    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedImageFile = file; // 파일 객체 저장
            uploadedFileName.textContent = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewAfter.style.backgroundImage = `url(${e.target.result})`;
                imagePreviewAfter.classList.add('has-image');
            };
            reader.readAsDataURL(file);

            // 이미지 첨부 후 화면으로 전환
            uploadSection.classList.remove('active');
            optionsSection.classList.add('active');
            // 옵션 화면의 파일 이름 업데이트
            uploadedFileNameAfter.textContent = file.name;

        } else {
            uploadedFileName.textContent = '';
            uploadedImageFile = null;
        }
    });

    // 파일 선택 시 처리 (옵션 화면) - 재업로드 시 동일하게 처리
    imageUploadInputAfter.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedImageFile = file; // 파일 객체 업데이트
            uploadedFileNameAfter.textContent = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewAfter.style.backgroundImage = `url(${e.target.result})`;
                imagePreviewAfter.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        } else {
            // 파일 선택 취소 시, 기존 파일 이름 유지 (또는 필요에 따라 초기화)
            uploadedFileNameAfter.textContent = uploadedImageFile ? uploadedImageFile.name : '';
        }
    });


    // 추가 요구사항 텍스트 필드 동적 생성
    addRequirementBtn.addEventListener('click', () => {
        const newFieldGroup = document.createElement('div');
        newFieldGroup.classList.add('req-field-group');

        const newInputField = document.createElement('input');
        newInputField.type = 'text';
        newInputField.placeholder = '추가 요구사항을 입력하세요';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-req-btn');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            newFieldGroup.remove(); // 해당 필드 그룹 삭제
        });

        newFieldGroup.appendChild(newInputField);
        newFieldGroup.appendChild(deleteButton);
        additionalReqFields.appendChild(newFieldGroup);
    });

    // 이미지 생성 버튼 클릭 시 정보 수집 및 전송 (가상)
    generateImageBtn.addEventListener('click', () => {
        if (!uploadedImageFile) {
            alert('이미지를 첨부해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('image', uploadedImageFile);

        // 테마 선택 값
        const selectedTheme = document.querySelector('input[name="theme"]:checked');
        if (selectedTheme) {
            formData.append('theme', selectedTheme.value);
        } else {
            alert('테마를 선택해주세요.');
            return;
        }

        // 분위기 선택 값
        const selectedMood = document.querySelector('input[name="mood"]:checked');
        if (selectedMood) {
            formData.append('mood', selectedMood.value);
        } else {
            alert('분위기를 선택해주세요.');
            return;
        }

        // 추가 요구사항 값들
        const additionalRequirements = [];
        document.querySelectorAll('#additionalReqFields input[type="text"]').forEach(input => {
            if (input.value.trim() !== '') {
                additionalRequirements.push(input.value.trim());
            }
        });
        if (additionalRequirements.length > 0) {
            formData.append('additionalRequirements', JSON.stringify(additionalRequirements));
        }

        // 제품 위치
        const selectedProductLocation = document.querySelector('input[name="productLocation"]:checked');
        if (selectedProductLocation) {
            formData.append('productLocation', selectedProductLocation.value);
        } else {
            alert('제품 위치를 선택해주세요.');
            return;
        }

        // 제품 크기
        const selectedProductSize = document.querySelector('input[name="productSize"]:checked');
        if (selectedProductSize) {
            formData.append('productSize', selectedProductSize.value);
        } else {
            alert('제품 크기를 선택해주세요.');
            return;
        }

        // 이미지 크기
        const imageSizeSelect = document.getElementById('imageSizeSelect');
        formData.append('imageSize', imageSizeSelect.value);

        // 콘솔에 수집된 데이터 출력 (실제 서버 전송 대신)
        console.log('--- 이미지 생성 요청 데이터 ---');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        alert('이미지 생성 요청이 콘솔에 출력되었습니다.');

        // 실제 서버로 전송하는 예시 (fetch API 사용)
        /*
        fetch('/api/generate-image', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('이미지 생성 결과:', data);
            // 결과를 사용자에게 보여주는 로직 추가
        })
        .catch(error => {
            console.error('이미지 생성 오류:', error);
            alert('이미지 생성 중 오류가 발생했습니다.');
        });
        */
    });
});