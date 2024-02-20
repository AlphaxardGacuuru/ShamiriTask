import "bootstrap/dist/css/bootstrap.css"
import "@/styles/style.css"

import React, { useState, useEffect, useRef } from "react"
import Axios from "axios"

import TopNav from "@/components/layouts/TopNav"
import Messages from "@/components/core/Messages"

const App = ({ Component, pageProps }) => {
	// Function for checking local storage
	const getLocalStorage = (state) => {
		if (typeof window !== "undefined" && localStorage.getItem(state)) {
			return JSON.parse(localStorage.getItem(state))
		} else {
			return []
		}
	}

	// Function for checking local storage
	const getLocalStorageAuth = (state) => {
		if (typeof window !== "undefined" && localStorage.getItem(state)) {
			return JSON.parse(localStorage.getItem(state))
		} else {
			return {
				name: "Guest",
				username: "@guest",
				avatar: "/storage/avatars/male-avatar.png",
				accountType: "normal",
				decos: 0,
				posts: 0,
				fans: 0,
			}
		}
	}

	// Function to set local storage
	const setLocalStorage = (state, data) => {
		localStorage.setItem(state, JSON.stringify(data))
	}

	const url = process.env.NEXT_PUBLIC_BACKEND_URL

	const apiUrl = "https://rickandmortyapi.com/api"

	// Declare states
	const [messages, setMessages] = useState([])
	const [errors, setErrors] = useState([])
	const [login, setLogin] = useState()
	const [auth, setAuth] = useState(getLocalStorageAuth("auth"))
	const [locations, setLocations] = useState([])
	const [characters, setCharacters] = useState([])

	// Function for fetching data from API
	const get = (endpoint, setState, storage = null, errors = true) => {
		Axios.get(`/api/${endpoint}`)
			.then((res) => {
				var data = res.data ? res.data.data : []
				setState(data)
				storage && setLocalStorage(storage, data)
			})
			.catch(() => errors && setErrors([`Failed to fetch ${endpoint}`]))
	}

	// Function for fetching data from API
	const getPaginated = (endpoint, setState, storage = null, errors = true) => {
		Axios.get(`/api/${endpoint}`)
			.then((res) => {
				var data = res.data ? res.data : []
				setState(data)
				storage && setLocalStorage(storage, data)
			})
			.catch(() => errors && setErrors([`Failed to fetch ${endpoint}`]))
	}

	// Function for showing iteration
	const iterator = (key, list) => {
		return key + 1 + list.meta.per_page * (list.meta.current_page - 1)
	}

	// Function for getting errors from responses
	const getErrors = (err, message = false) => {
		const resErrors = err.response.data.errors
		var newError = []
		for (var resError in resErrors) {
			newError.push(resErrors[resError])
		}
		// Get other errors
		message && newError.push(err.response.data.message)
		setErrors(newError)
	}

	// Fetch data on page load
	useEffect(() => {
		// Import Js for Bootstrap
		import("bootstrap/dist/js/bootstrap")

		get("auth", setAuth, "auth", false)
	}, [])

	/*
	 * Extract Character IDs
	 */
	const extractCharacterIds = (residents) => {
		return residents.map((url) => {
			// Split the URL by "/" to get an array of path segments
			const pathSegments = url.split("/")

			// Filter out any empty segments
			const nonEmptySegments = pathSegments.filter((segment) => segment !== "")

			// Extract the last parameter from the filtered segments
			const lastParameter = nonEmptySegments[nonEmptySegments.length - 1]

			return parseInt(lastParameter)
		})
	}

	/*
	 * Extract Episode IDs
	 */
	const extractEpisodeIds = (episodeUrls) => {
		return episodeUrls.map((url) => {
			const pathSegments = url.split("/")
			const nonEmptySegments = pathSegments.filter((segment) => segment !== "")
			const lastParameter = nonEmptySegments[nonEmptySegments.length - 1]
			return parseInt(lastParameter)
		})
	}

	/*
	 * Fetch Episodes
	 */
	const fetchEpisodes = async (episodeIds, apiUrl) => {
		const episodeRequests = episodeIds.map(async (episodeId) => {
			try {
				const response = await Axios.get(`${apiUrl}/episode/${episodeId}`)
				return response.data
			} catch (error) {
				// Handle error
				console.error(`Error fetching episode ${episodeId}:`, error)
				throw error
			}
		})

		return Promise.all(episodeRequests)
	}

	/*
	 * Fetch Characters
	 */
	const fetchCharacters = async (characterIds, apiUrl) => {
		try {
			const characters = await Promise.all(
				characterIds.map(async (characterId) => {
					const response = await Axios.get(`${apiUrl}/character/${characterId}`)
					const character = response.data
					const episodeIds = extractEpisodeIds(character.episode)
					const episodes = await fetchEpisodes(episodeIds, apiUrl)
					character.episodes = episodes
					return character
				})
			)

			return characters
		} catch (error) {
			// Handle error
			console.error("Error fetching characters:", error)
			throw error
		}
	}

	/*
	 * Fetch Locations
	 */
	const getLocations = async () => {
		try {
			const response = await Axios.get(`${apiUrl}/location`)
			const locations = await Promise.all(
				response.data.results.map(async (location) => {
					const characterIds = extractCharacterIds(location.residents)
					const characters = await fetchCharacters(characterIds, apiUrl)
					location.characters = characters
					return location
				})
			)

			setLocations(locations)
		} catch (error) {
			// Handle error
			console.error("Error fetching locations:", error)
		}
	}

	useEffect(() => {
		getLocations()
	}, [])

	const GLOBAL_STATE = {
		getLocalStorage,
		setLocalStorage,
		url,
		messages,
		setMessages,
		errors,
		setErrors,
		get,
		getPaginated,
		iterator,
		getErrors,
		login,
		setLogin,
		auth,
		setAuth,
		apiUrl,
		locations,
		setLocations,
		characters,
		setCharacters,
	}

	return (
		<div>
			<TopNav {...GLOBAL_STATE} />
			<Component {...pageProps} {...GLOBAL_STATE} />
			<Messages {...GLOBAL_STATE} />
		</div>
	)
}

export default App
