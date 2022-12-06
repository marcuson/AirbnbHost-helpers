export async function downloadImg(imageUrl: string) {
  const resp = await fetch(imageUrl);
  const data = await resp.blob();
  const tmpImageUrl = window.URL.createObjectURL(data);
  const tag = document.createElement('a');
  tag.href = tmpImageUrl;
  tag.download = '';
  document.body.appendChild(tag);
  tag.click();
  document.body.removeChild(tag);
}
