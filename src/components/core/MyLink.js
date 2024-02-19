import React from "react"
import Link from "next/link"

const MyLink = ({ text, linkTo, className }) => (
	<Link href={linkTo}>
		<a
			className={`btn btn-outline-primary rounded-pill text-capitalize ${className}`}>
			{text}
		</a>
	</Link>
)

MyLink.defaultProps = {
	linkTo: "/",
}

export default MyLink
