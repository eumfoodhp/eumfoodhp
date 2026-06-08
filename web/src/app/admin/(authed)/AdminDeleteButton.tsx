'use client';

/**
 * 어드민 공통 삭제 버튼 (수정/상세 페이지용).
 * 별도 "삭제 박스" 를 없애고 저장/취소 옆에 함께 두기 위함 (사용자 요청).
 * - 같은 form 안에 두고 formAction 으로 삭제 서버액션을 호출 (form 의 id hidden 값 사용)
 * - formNoValidate: 수정 폼의 required 검증을 건너뛰고 삭제 가능
 * - confirm: 저장 버튼 옆이라 실수 클릭 방지로 한 번 확인
 */
export default function AdminDeleteButton({
  action,
  label = '삭제',
  message = '정말 삭제할까요? 되돌릴 수 없습니다.',
}: {
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  message?: string;
}) {
  return (
    <button
      type="submit"
      formAction={action}
      formNoValidate
      className="admin_btn danger"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
