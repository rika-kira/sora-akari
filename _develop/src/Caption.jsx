import { useState } from 'react';
import './caption.css';

function Caption(){
    const [isView, setIsView] = useState(false);
    return(
        <>
            <div id="cap" className={isView?"show":"hidden"} onClick={()=> setIsView(!isView)}>
                <div className="capMsg">
                    ▼<br />
                    かんじたことを とばす<br />
                    どこに とぶかは わからない<br />
                    もしかしたら だれかに とどくかも<br />
                    だれかの きもちも とどくかも
                </div>
            </div>
        </>
    )
}



export default Caption;