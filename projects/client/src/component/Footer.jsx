import React from "react";
import { FaCopyright } from "react-icons/fa";

export default function Footer(props) {
    return (
        <div className={props.bgColor}>
            <div className="h-7 w-full p-1 text-center grid font-mont text-sm">
                <p className="font-ysa text-babypowder text-xs text-center ">Copyright <FaCopyright className="text-xxs inline-block" /> 2023. All rights reserved</p>
            </div>
        </div>
    )
}