
export async function my_request(endpoint: string) {
  //Truy van den duong dan
  const response = await fetch(endpoint);

  //Neu tra ve loi
  if (!response.ok) {
    throw new Error(`Không thể truy cập ${endpoint}`);
  }
  return response.json();
}