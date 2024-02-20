import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Axios from "@/lib/axios"

import LogoSVG from "@/svgs/LogoSVG"

const TopNav = (props) => {
	const router = useRouter()

	const logout = () => {
		Axios.post(`/logout`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove phone from localStorage
				localStorage.clear()
				// Redirect
				router.reload()
			})
			.catch((err) => {
				props.getErrors(err)
				// Remove phone from localStorage
				localStorage.clear()
				// Reload
				router.reload()
			})
	}

	// Function for showing active color
	const active = (check) => {
		return (
			router.pathname.match(check) &&
			"rounded-end-pill text-primary bg-primary-subtle"
		)
	}

	// Function for showing active color
	const activeStrict = (check) => {
		return (
			router.pathname == check &&
			"rounded-end-pill text-primary bg-primary-subtle"
		)
	}

	const visibility =
		router.pathname.match("/login") || router.pathname.match("/register")
			? "invisible"
			: ""

	return (
		<React.Fragment>
			<header className={`header-area ${visibility}`}>
				<div className="container-fluid p-0">
					<div className="row">
						<div className="col-12" style={{ padding: "0" }}>
							<div className="menu-area d-flex justify-content-between">
								<div className="d-flex align-items-center">
									{/* <!-- Logo Area  --> */}
									<div className="logo-area">
										<Link href="/">
											<a className="text-primary fw-lighter p-2">
												<LogoSVG />
											</a>
										</Link>
									</div>
								</div>

								<div className="menu-content-area d-flex align-items-center"></div>
							</div>
						</div>
					</div>
				</div>
			</header>
			<br />
			<br />
			<br />
		</React.Fragment>
	)
}

export default TopNav
