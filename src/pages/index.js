import React, { useEffect, useState } from "react"
import Link from "next/link"
// import Axios from "@/lib/axios"
import Axios from "axios"

import MyLink from "@/components/core/MyLink"
import Img from "@/components/core/Img"

import LocationSVG from "@/svgs/LocationSVG"

const index = (props) => {
	const [locationName, setlocationName] = useState("")
	const [characterName, setCharacterName] = useState("")
	const [episodeName, setEpisodeName] = useState("")

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
			const response = await Axios.get(`${props.apiUrl}/location`)
			const locations = await Promise.all(
				response.data.results.map(async (location) => {
					const characterIds = extractCharacterIds(location.residents)
					const characters = await fetchCharacters(characterIds, props.apiUrl)
					location.characters = characters
					return location
				})
			)

			props.setLocations(locations)
		} catch (error) {
			// Handle error
			console.error("Error fetching locations:", error)
		}
	}

	useEffect(() => {
		getLocations()
	}, [])

	/*
	 * Highlight Status based on value
	 */
	const highlightStatus = (status) => {
		switch (status) {
			case "Alive":
				return "bg-success-subtle text-success rounded-pill"

			case "Dead":
				return "bg-danger-subtle text-danger rounded-pill"

			default:
				return "bg-warning-subtle text-warning rounded-pill"
		}
	}

	return (
		<div className="row px-4">
			<div className="col-sm-1"></div>
			<div className="col-sm-10">
				<h1>Rick and Morty Locations</h1>
				{/* Data */}
				<div className="shadow p-2">
					<div className="d-flex justify-content-between">
						{/* Total */}
						<div className="d-flex justify-content-between w-100 align-items-center mx-4">
							<div>
								<span className="fs-4">{props.locations.length}</span>
								<h4>Total Locations</h4>
							</div>
							<div className="fs-1 py-3 px-4 bg-secondary-subtle text-secondary rounded-circle">
								<LocationSVG />
							</div>
						</div>
						{/* Total End */}
					</div>
				</div>
				{/* Data End */}

				<br />

				{/* Filters */}
				<div className="shadow p-4">
					<div className="d-flex flex-wrap">
						{/* Name */}
						<div className="flex-grow-1 me-2 mb-2">
							<input
								id=""
								type="text"
								placeholder="Search by Name"
								className="form-control"
								onChange={(e) => setlocationName(e.target.value)}
							/>
						</div>
						{/* Name End */}
						{/* Character Name */}
						<div className="flex-grow-1 me-2 mb-2">
							<input
								id=""
								type="text"
								placeholder="Search by Character Name"
								className="form-control"
								onChange={(e) => setCharacterName(e.target.value)}
							/>
						</div>
						{/* Character Name End */}
						{/* Episode Name */}
						<div className="flex-grow-1 me-2 mb-2">
							<input
								id=""
								type="text"
								placeholder="Search by Episode Name"
								className="form-control"
								onChange={(e) => setEpisodeName(e.target.value)}
							/>
						</div>
						{/* Episode Name End */}
					</div>
				</div>
				{/* Filters End */}

				<br />

				{/* Location */}
				<div className="shadow p-4 mb-5">
					<div className="hidden-scroll" style={{ backgroundColor: "#FFF" }}>
						<table className="table table-hover">
							<thead>
								<tr>
									<th colSpan="2">#</th>
									<th>Name</th>
									<th>Type</th>
								</tr>
							</thead>
							<tbody className="table-group-divider">
								{props.locations
									?.filter((location) => {
										var name = location.name.toLowerCase()
										var query = locationName.toLowerCase()

										return name.match(query)
									})
									.filter((location) => {
										if (characterName) {
											return location.characters.some((character) => {
												var name = character.name.toLowerCase()
												var query = characterName.toLowerCase()

												return name.match(query)
											})
										} else {
											return true
										}
									})
									.filter((location) => {
										if (episodeName) {
											return location.characters.some((character) => {
												return character.episodes.some((episode) => {
													var name = episode.episode.toLowerCase()
													var query = episodeName.toLowerCase()

													return name.match(query)
												})
											})
										} else {
											return true
										}
									})
									.map((location, key) => (
										<React.Fragment key={key}>
											<tr key={key}>
												<td>{key + 1}</td>
												<td>
													{/* Accordion Button */}
													<div id={`accordionMenu${key}`} className="accordion">
														<button
															className={`accordion-button rounded-pill p-1 px-2 ${
																key != 0 && "collapsed"
															}`}
															type="button"
															data-bs-toggle="collapse"
															data-bs-target={`#collapseMenu${key}`}
															aria-expanded="true"
															aria-controls={`collapseMenu${key}`}>
															Show Residents
														</button>
													</div>
													{/* Accordion Button End */}
												</td>
												<td>{location.name}</td>
												<td>{location.type}</td>
											</tr>
											{/* Characters */}
											<tr>
												<td colSpan="1" className="p-0"></td>
												<td colSpan="3" className="p-0">
													<div className="accordion" id={`accordionMenu${key}`}>
														<div
															id={`collapseMenu${key}`}
															className={`accordion-collapse collapse ${
																key == 0 && "show"
															}`}
															data-bs-parent={`#accordionMenu${key}`}>
															<div className="accordion-body">
																<table className="table table-hover">
																	<thead>
																		<tr>
																			<th>#</th>
																			<th></th>
																			<th>Name</th>
																			<th>Status</th>
																			{/* <th>Species</th> */}
																			{/* <th>Type</th> */}
																			{/* <th>Gender</th> */}
																			{/* <th>Origin</th> */}
																			<th>Action</th>
																		</tr>
																	</thead>
																	<tbody>
																		{location.characters.map(
																			(character, key2) => (
																				<tr key={key2}>
																					<td>{key2 + 1}</td>
																					<td>
																						<Img
																							src={character.image}
																							imgClass="rounded-circle bg-primary-subtle p-1"
																							width="50px"
																							height="50px"
																						/>
																					</td>
																					<td>{character.name}</td>
																					<td>
																						<span
																							className={`text-capitalize ${highlightStatus(
																								character.status
																							)}`}>
																							{character.status}
																						</span>
																					</td>
																					{/* <td>{character.species}</td> */}
																					{/* <td>{character.type}</td> */}
																					{/* <td>{character.gender}</td> */}
																					{/* <td>{character.origin.name}</td> */}
																					<td>
																						<div className="d-flex">
																							<div className="me-1">
																								<MyLink
																									className="btn-sm"
																									linkTo={`/character/${character.id}`}
																									text="view"
																								/>
																							</div>
																						</div>
																					</td>
																				</tr>
																			)
																		)}
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</td>
											</tr>
										</React.Fragment>
									))}
							</tbody>
						</table>
					</div>
				</div>
				{/* Location Area End */}
			</div>
			<div className="col-sm-1"></div>
		</div>
	)
}

export default index
