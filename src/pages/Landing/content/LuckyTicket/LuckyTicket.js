import { Button, Col, Row, Space } from "antd";
import { Link } from "react-router-dom";
import { SFEED_ANIMATION } from "src/constants/const";
import FadeAnimationEven from "src/layout/fadeAnimation/FadeAnimationEven";
import Container from "src/layout/grid/Container";
import BaseHelper from "src/utils/BaseHelper";
import CountdownClock from "./CountdownClock";

function LuckyTicket({ ticketJoinedLucky, _expiredTime }) {
	return (
		<section className="section" id="section-lucky-ticket">
			<FadeAnimationEven />
			<Container>
				<Row justify="space-between" gutter={[30, 80]}>
					<Col
						xs={{ order: 2 }}
						md={{ order: 1, span: 12 }}
						data-aos="zoom-out"
						data-aos-delay={SFEED_ANIMATION.DELAY - 500}
					>
						<Space direction="vertical" size={30}>
							<Space direction="vertical" size={15}>
								<div className="module-header-small module-header-small-number">
									{ticketJoinedLucky} / {`${BaseHelper.numberWithDots(50000)}`}
								</div>
								<div className="module-blur">Ticket Joined</div>
							</Space>
							<Space direction="vertical" size={15}>
								<div className="module-header-small module-header-small-number">
									<CountdownClock expiredTime={_expiredTime} />
								</div>
								<div className="module-blur">Remaining Days</div>
							</Space>
						</Space>
					</Col>
					<Col xs={{ order: 1 }} md={{ order: 2, span: 12 }}>
						<Space direction="vertical" size={30}>
							<div className="module-header-small" data-aos="zoom-in-left">
								Lucky Ticket
							</div>
							<div
								className="module-blur"
								data-aos="fade-left"
								data-aos-delay={SFEED_ANIMATION.DELAY - 800}
							>
								The first time in Crypto, By joining in Lucky ticket event, you
								will have big chance to increase WDA amount up to 600% in
								average, 10,000% for the luckiest person, within 5 days and
								absolute safety.
							</div>
							<div
								className="module-btn"
								data-aos="fade-left"
								data-aos-delay={SFEED_ANIMATION.DELAY - 500}
							>
								<Button>
									<Link to={"/products-lucky-ticket"}>+ Join Now</Link>
								</Button>
							</div>
						</Space>
					</Col>
				</Row>
			</Container>
		</section>
	);
}

export default LuckyTicket;
