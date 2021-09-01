import React from "react";

const HookTester : React.FC = ()=> {
    return (
        <div style={{display:'inline-block', marginTop: '5em'}}>
            <button className="mr-3">Add One</button>
            <button className="mr-3">Add Five</button>
            <button className="mr-3">Add Twenty</button>
            <button  className="mr-3">Add Hundered</button>
        </div>
    );
};

export default HookTester;