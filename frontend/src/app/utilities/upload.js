import axios from 'axios';

const upload = (url, files) => {
  const data = new FormData();

  for (let i = 0; i < files.length; i++) {
    data.append('files', files[i]);
  }

  return axios.post(url, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
};

export default upload;
