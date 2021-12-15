// CORE
import React, { Component } from 'react';

// USER DEFINED
import Routes from "Routes/Route";
import { ContentWrapper } from "./Website.style";


class Website extends Component {

	render() {
		return (
			<React.Fragment>
				<ContentWrapper>
					<Routes />
				</ContentWrapper>
			</React.Fragment>
		);
	}
}

export default Website;