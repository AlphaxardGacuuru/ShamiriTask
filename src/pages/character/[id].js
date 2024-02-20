import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Axios from "@/lib/axios"
import Axios2 from "axios"

import Img from "@/components/core/Img"
import Btn from "@/components/core/Btn"
import BackSVG from "@/svgs/BackSVG"
import Link from "next/link"

// This gets called on every request
export async function getServerSideProps(context) {
	const { id } = context.query

	var data = {
		character: {},
	}

	// Fetch Newly Released
	await Axios2.get(`https://rickandmortyapi.com/api/character/${id}`).then(
		(res) => (data.character = res.data)
	)

	return { props: data }
}

const view = (props) => {
	const router = useRouter()

	let { id } = router.query

	const [character, setCharacter] = useState("")
	const [notes, setNotes] = useState("")
	const [loading, setLoading] = useState()

	useEffect(
		() =>
			Axios.get(`/api/characters/${id}`)
				.then((res) => setCharacter(res.data.data))
				.catch((err) => console.log(err)),
		[]
	)

	/*
	 * Handle Form Submission
	 */
	const onSubmit = () => {
		setLoading(true)

		Axios.post("/api/characters", { characterId: id, notes: notes })
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

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
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<div className="shadow m-2 mb-5 py-5 text-center">
					<center>
						<div className="text-start p-2">
							<Link href="/">
								<a className="text-primary">
									<BackSVG />
									<span className="fs-5">Back</span>
								</a>
							</Link>
						</div>
						{/* Profile Area */}
						<div className="mt-4">
							<Img
								src={props.character.image}
								imgClass="rounded-circle bg-primary-subtle p-2"
								width="200px"
								height="200px"
							/>
						</div>
						<br />
						<h1>{props.character.name}</h1>
						<h4>
							<span
								className={`text-capitalize py-2 px-4 ${highlightStatus(
									props.character.status
								)}`}>
								{props.character.status}
							</span>
						</h4>
						<h4>{props.character.species}</h4>
						<h4>{props.character.type}</h4>
						<h4>{props.character.gender}</h4>
						<h4>{props.character.origin.name}</h4>

						<hr className="w-75 mx-auto" />

						<div className="m-4">
							<textarea
								className="form-control mb-2"
								placeholder={`Write some notes about ${props.character.name}`}
								rows="5"
								defaultValue={character.notes}
								onChange={(e) => setNotes(e.target.value)}></textarea>
							<Btn btnText="save" loading={loading} onClick={onSubmit} />
						</div>
					</center>
				</div>
			</div>
			<div className="col-sm-4"></div>
		</div>
	)
}

export default view
