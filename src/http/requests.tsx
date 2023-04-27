import axios from "axios";
import store from "../store/store";

const url = "http://127.0.0.1:8000/"
const config = {
  headers: { Authorization: `Bearer ${store.getState().token}` },
};

export async function fetchFeedItems(page?: number) {
    if(!page) {
      page = 1;
    }
    try {
      const response = await axios.get(`${url}posts/?page=${page}`);
      const data = response.data.results;
      if(response.data.count && response.data.next){
        const totalPages = Math.ceil(response.data.count / 10);
        if (page < totalPages) {
          const nextPage = page + 1;
          const nextData: any = await fetchFeedItems(nextPage);
          return data.concat(nextData);
        }
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }

// export async function fetchFeedItems(page?: number) {
//   if(!page) {
//     page = 1;
//   }
//   try {
//     const response = await axios.get(`${url}posts/?page=${page}`);
//     const data = response.data.results;
//     if(response.data.count && response.data.next){
//       const totalPages = Math.ceil(response.data.count / 10);
//       if (page < totalPages) {
//         const nextPage = page + 1;
//         const nextData: any = await fetchFeedItems(nextPage);
//         return data.concat(nextData);
//       }
//     }
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function postFeedItem(username: string, title: string, content: string) {
  try {
    const data = {
      username: username,
      title: title,
      content: content,
    };
    await axios.post(`${url}posts/`, data)
  } catch (error) {
    console.error(error);
  }
}

export async function editPost(id: string, title: string, content: string) {
  try {
    const data = {
      title: title,
      content: content,
    }
    await axios.patch(`https://dev.codeleap.co.uk/careers/${id}`, data, config);
  } catch (error) {
    console.error(error);
  }
}

export async function isTokenValid(token: string) {
  try {
    const response = await axios.post(`${url}isTokenValid/`, { "token": token });
    if (response.status === 200) {
      return true;
    }
    
    return false;
  } catch(error) {
    console.error(error);
    return false;
  }
}

export async function login(username: string, password: string) {
  try {
    const data = {
      "username": username,
      "password": password
    }
    const response = await axios.post(`${url}login/`, data);
    return response;
  } catch(error) {
    console.error(error);
  }
}

export async function register(username: string, password: string, email: string) {
  try {
    const data = {
      "username": username,
      "email": email,
      "password": password
    }
    const response = await axios.post(`${url}register/`, data);
    return response;
  } catch(error) {
    console.error(error);
  }
}