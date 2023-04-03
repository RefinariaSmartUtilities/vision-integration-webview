function processResponse(response) {
  const statusCode = response.status;
  const data = response.json();
  return Promise.all([statusCode, data]).then(res => ({
    statusCode: res[0],
    data: res[1]
  }));
}

export async function callAPI(url, method, body, success, failure) {
  try {
    const repoCall = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: body,
    })
    .then(processResponse)
    .then(res => {
      const { statusCode, data } = res;
      if (statusCode == 200) {
        success();
      }
      else if (statusCode == 400) {
        failure(`${data.error}`);
      } else {
        failure(`${String(statusCode)} - Falha na rede.`);
      }
    })
    .catch(error => {
      failure('Falha na conexão');
    });
  } catch (err) {
    failure('Falha na operação.');
  }
}
