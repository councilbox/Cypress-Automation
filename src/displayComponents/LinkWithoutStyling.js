import React from "react";
import { Link } from "react-router-dom";

export default ({ to, children, id, styles }) => (
	<Link
		to={to}
		id={id}
		style={{
			textDecoration: "none",
			color: "inherit",
			...styles
		}}
	>
		{children}
	</Link>
);
