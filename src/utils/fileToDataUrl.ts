export async function fileToDataUrl(
  file: File,
  maxWidthOrHeight: number = 2500,
  quality: number = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error("FileReader failed"));
        return;
      }

      // 이미지가 아닌 경우 원본 Data URL 반환 (보통 발생하지 않음)
      if (!file.type.startsWith("image/")) {
        resolve(dataUrl);
        return;
      }

      // WebP, JPEG, PNG 등의 이미지인 경우 리사이즈/압축 수행
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // 크기 제한 계산 (비율 유지)
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          } else {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl); // 실패 시 원본 Data URL 반환
          return;
        }

        // 투명도 등 유지를 위해 먼저 그려내기
        ctx.drawImage(img, 0, 0, width, height);

        // 출력 타입 결정: 투명화 이미지는 WebP로 시도, 나머지는 JPEG(GIF 미지원)
        const outputType =
          file.type === "image/png" ||
          file.type === "image/webp" ||
          file.type === "image/svg+xml"
            ? "image/webp"
            : "image/jpeg";

        try {
          const compressedDataUrl = canvas.toDataURL(outputType, quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn("Canvas export failed, falling back to original", err);
          resolve(dataUrl); // 실패 시 원본 Data URL 반환
        }
      };

      img.onerror = () => {
        reject(new Error("Image processing failed"));
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      reject(new Error("FileReader processing failed"));
    };

    reader.readAsDataURL(file);
  });
}
