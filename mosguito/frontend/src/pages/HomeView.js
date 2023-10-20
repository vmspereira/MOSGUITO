import { useEffect, useState } from "react";
import Constants from "../Constants";
import axios from "axios";
import React from "react";
import HomeLevels from "../components/home/HomeLevels";
import HomeHow from "../components/home/HomeHow";

function HomeView() {

    useEffect(() => {
        async function onStart() {
            const query = Constants.sddb_api_url + "api/homepageStats/"
            const result = await axios(query);
        }
        onStart();
    }, [])
    
    return (
        <>
        <HomeLevels />
        <HomeHow />
        </>
  );
}
    

export default HomeView;