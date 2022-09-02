import React, { useState } from "react";

function ComingSoon(props) {
    const [count, setCount] = useState(0);
    const clickHandler = () => {
        setCount(count + 1) // 1 -> 2 -> 3
    }
    return <div id="commingsoon" onClick={clickHandler}> {count}
    </div>;
}
export default ComingSoon;
