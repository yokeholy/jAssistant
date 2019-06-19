import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import API from "../services/api";

class Lifestyle extends React.Component {
    state = {
        showingFooter: true,
        lifestyles: []
    };

    componentDidMount () {
        this.getLifestyle();
    }

    getLifestyle () {
        API.get("/lifestyle/getLifestyle")
            .then(response => {
                this.setState({
                    lifestyles: response.data.data.lifestyles
                });
            });
    }
    lifestyleUp = lifestyleId => {
        API.post("/lifestyle/upLifestyle", { lifestyleId })
            .then(() => {
                toast.success("Cheers! Keep this good lifestyle up.");
                this.getLifestyle();
            });
    }

    render () {
        const lifestyleList = this.state.lifestyles.length
            ? this.state.lifestyles.map(lifestyle =>
                <div key={ lifestyle.lifestyleId } className={`col-12 col-md-${12 / this.state.lifestyles.length} lifestyleSection clickable`} onClick={ () => this.lifestyleUp(lifestyle.lifestyleId)}>
                    <div className="plusIcon bg-info">
                        <i className="fas fa-plus"></i>
                    </div>
                    <div className="row mt-2">
                        {
                            [...Array(lifestyle.lifestyleDailyValue).keys()].map(value =>
                                <div className={`col-1 ${value < lifestyle.todayValue ? "text-info" : ""}`} key={ value }>
                                    <i className="fas fa-tint"></i>
                                </div>
                            )
                        }
                    </div>
                    <h5 className="mb-0 mt-2">{ lifestyle.lifestyleName }</h5>
                    <p className="text-muted">{ lifestyle.lifestyleCaption || "Hahaha" }</p>
                </div>)
            : <div>
                nothing
            </div>;

        return (
            <footer className="fixed-bottom bg-secondary">
                <div id="toggleFooter" className="d-block d-md-none">
                    <button className="btn btn-block btn-secondary" onClick={ () => this.setState({ showingFooter: !this.state.showingFooter }) }>
                        { !this.state.showingFooter
                            && <span>
                                <i className="fas fa-chevron-up"></i><br />
                            </span>
                        }
                        Lifestyle
                        { this.state.showingFooter
                            && <span>
                                <br /><i className="fas fa-chevron-down"></i>
                            </span>
                        }
                    </button>
                </div>
                { this.state.showingFooter
                    ? <div className="container-fluid p-2">
                        <div className="row">
                            { lifestyleList }
                        </div>
                    </div>
                    : null
                }
            </footer>
        );
    }
}

Lifestyle.propTypes = {
    hideEverything: PropTypes.bool.isRequired
};

// Map JData from Redux to this component
const mapStateToProps = state => state;

export default connect(mapStateToProps)(Lifestyle);
