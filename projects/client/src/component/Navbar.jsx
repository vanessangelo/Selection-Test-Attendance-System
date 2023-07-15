import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <Link to="/">
                <Logo />
            </Link>
        </>
    )
}