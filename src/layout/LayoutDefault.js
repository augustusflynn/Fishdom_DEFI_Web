import { Layout } from "antd";
import AOS from "aos";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./../../node_modules/aos/dist/aos.css";
import { SFEED_ANIMATION } from "./../constants/const";
import FooterLayout from "./FooterLayout";
import HeaderLayout from "./Topbar/index";
import TopbarMobile from "./TopbarMobile";

const { Header, Content, Footer } = Layout;
function LayoutDefault() {
	useEffect(() => {
		window.addEventListener("scroll", (event) => {
			if (document.getElementById("header-layout")) {
				if (window.pageYOffset > 10) {
					document.getElementById("header-layout").classList.add("scrolled");
				} else if (window.pageYOffset == 0) {
					document.getElementById("header-layout").classList.remove("scrolled");
				}
			}
		});
		AOS.init({
			duration: SFEED_ANIMATION.DURATION,
			once: true,
			easing: "ease",
		});
		AOS.refresh();
	}, []);

	return (
		<React.Fragment>
			<Layout id="layout" className="layout">
				<Header id="header-layout" className="header-layout">
					<TopbarMobile />
					<HeaderLayout />
				</Header>
				<Content id="main-layout" className="content-layout">
					<Outlet />
				</Content>
				<Footer id="footer-layout" className="footer-layout">
					<FooterLayout />
				</Footer>
			</Layout>
		</React.Fragment>
	);
}
export default LayoutDefault;
