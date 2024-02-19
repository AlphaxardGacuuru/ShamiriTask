import React, { useEffect, useState } from "react"
import Link from "next/link"
// import Axios from "@/lib/axios"
import Axios from "axios"

import MyLink from "@/components/core/MyLink"
import Img from "@/components/core/Img"

const index = (props) => {
	const [name, setName] = useState()
	const [characterName, setCharacterName] = useState()
	const [episodeName, setEpisodeName] = useState()

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
	 * Fetch Characters
	 */
	const fetchCharacters = (characterIds, apiUrl) => {
		const characterRequests = characterIds.map((characterId) =>
			Axios.get(`${apiUrl}/character/${characterId}`)
		)

		return Promise.all(characterRequests).then((responses) =>
			responses.map((res) => res.data)
		)
	}

	/*
	 * Fetch Locations
	 */
	const getLocations = () => {
		Axios.get(`${props.apiUrl}/location`).then((res) => {
			var locations = res.data.results.map((location) => {
				const characterIds = extractCharacterIds(location.residents)

				return fetchCharacters(characterIds, props.apiUrl).then(
					(characters) => {
						location.characters = characters
						return location
					}
				)
			})

			Promise.all(locations).then((completedLocations) => {
				console.log(completedLocations)
				props.setLocations(completedLocations)
			})
		})
	}

	useEffect(() => getLocations(), [])

	return (
		<div className="row px-4">
			<div className="col-sm-1"></div>
			<div className="col-sm-10">
				<h1>Rick and Morty Locations</h1>

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
								{props.locations.map((location, key) => (
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
											<td colSpan="2" className="p-0"></td>
											<td colSpan="8" className="p-0">
												<div className="accordion" id={`accordionMenu${key}`}>
													<div
														id={`collapseMenu${key}`}
														className={`accordion-collapse ${
															key != 0 && "collapse"
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
																		<th>Species</th>
																		<th>Type</th>
																		<th>Gender</th>
																		<th>Origin</th>
																		<th>Episode</th>
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
																						className="shadow-lg p-2"
																						width="100px"
																						height="auto"
																					/>
																				</td>
																				<td>{character.name}</td>
																				<td>{character.status}</td>
																				<td>{character.species}</td>
																				<td>{character.type}</td>
																				<td>{character.gender}</td>
																				<td>{character.origin.name}</td>
																				<td>{character.episode}</td>
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
