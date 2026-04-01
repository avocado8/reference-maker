import { fileToDataUrl } from "../utils/fileToDataUrl";

interface UseImageUploadOptions {
  onSuccess: (url: string) => void;
}

/**
 * 이미지 업로드 및 Base64 변환 공통 로직을 처리하는 훅
 */
export function useImageUpload({ onSuccess }: UseImageUploadOptions) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // 파일이 없으면 그냥 리셋 후 종료
    if (!file) {
      e.target.value = "";
      return;
    }

    try {
      const url = await fileToDataUrl(file);
      onSuccess(url);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(
        "이미지 처리에 실패했습니다. 유효한 이미지인지 확인 후 다시 시도해주세요."
      );
    } finally {
      // 동일한 파일을 연속으로 업로드할 수 있도록 input value 초기화
      e.target.value = "";
    }
  };

  return { handleImageUpload };
}
