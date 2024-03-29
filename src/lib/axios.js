import Axios from "axios"

// Function for checking local storage
const getLocalStorage = (state) => {
	if (typeof window !== "undefined" && localStorage.getItem(state)) {
		return JSON.parse(localStorage.getItem(state))
	} else {
		return []
	}
}

const axios = Axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		"X-Requested-With": "XMLHttpRequest",
		Authorization: `Bearer ${getLocalStorage("sanctumToken")}`,
	},
	withCredentials: true,
})

export default axios
