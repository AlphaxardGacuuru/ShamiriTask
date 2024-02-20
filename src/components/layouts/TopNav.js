import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Dialog } from "@headlessui/react"
import Axios from "@/lib/axios"

import Img from "@/components/core/Img"

import CloseSVG from "@/svgs/CloseSVG"
import LogoutSVG from "@/svgs/LogoutSVG"
import PersonSVG from "@/svgs/PersonSVG"
import HomeSVG from "@/svgs/HomeSVG"

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
										<Link href="/" className="text-white fw-lighter">
											Shamiri Task
										</Link>
									</div>
								</div>

								<div className="menu-content-area d-flex align-items-center">
									{/* <!-- Header Social Area --> */}
									<div className="header-social-area d-flex align-items-center">
										{props.auth.name == "Guest" ? (
											<Link href="/login">
												<a className="display-4 text-white">Login</a>
											</Link>
										) : (
											<div className="dropdown-center">
												{/* Avatar */}
												<a
													href="#"
													role="button"
													className="hidden"
													data-bs-toggle="dropdown"
													aria-expanded="false">
													<PersonSVG />
												</a>
												{/* Avatar End */}
												<div className="dropdown-menu rounded-0 m-0 p-0 bg-white">
													<div className="d-flex">
														<div className="ps-2">
															<h5 className="text-wrap">{props.auth?.name}</h5>
														</div>
													</div>
													<Link href="#">
														<a
															className="p-2 px-3 dropdown-item"
															onClick={(e) => logout(e)}>
															<h6>
																<span className="me-2">
																	<LogoutSVG />
																</span>
																Logout
															</h6>
														</a>
													</Link>
												</div>
											</div>
										)}
									</div>
								</div>
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
