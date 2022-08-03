/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import * as React from "react";
import "../style/NoFieldsPlaceholder.css";


class NoFieldsPlaceholder extends React.Component {
    render() {
        return (
            <div>
                <p>Select fields to populate this visual</p>
                <svg className="nofields-image" x="0px" y="0px" viewBox="0 0 400 300" enable-background="new 0 0 400 300">
                    <rect className="hcOuterLine" x="0" y="0" fill="#F4F4F4" width="400" height="300"></rect>
                    <rect className="hcArea" x="11.8" y="17.7" fill="#D0D2D3" width="34.7" height="15.3"></rect>
                    <rect className="hcArea" x="34.1" y="57" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="55" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcOuterLine" x="12.8" y="79" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="105" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="103" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="129" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="127" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="153" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="151" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="177" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="175" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="201" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="199" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="225" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="223" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="249" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="247" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="273" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <rect className="hcOuterLine" x="12.8" y="271" fill="none" stroke="#D0D2D3" stroke-width="2" stroke-miterlimit="10" width="11.3" height="11.3"></rect>
                    <rect className="hcArea" x="34.1" y="81.7" fill="#D0D2D3" width="33.8" height="7.7"></rect>
                    <line className="hcGridLine" fill="none" stroke="#D0D2D3" stroke-miterlimit="10" x1="3" y1="44.3" x2="397" y2="44.3"></line>
                </svg>
            </div>

        );
    }
}

export default NoFieldsPlaceholder;