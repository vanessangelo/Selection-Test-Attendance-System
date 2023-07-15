import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Logo(props) {
    return (
        <div className="h-fit w-fit p-2">
            <div className="font-rob text-2xl font-extrabold flex gap-3 tracking-wide">
                <img src="https://cdn-icons-png.flaticon.com/512/9352/9352250.png" className="h-9 " />
                <h1 className={props.textColor}>COMPANY</h1>
            </div>
        </div>
    );
}