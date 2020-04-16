import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    getContestsForCreative,
    clearContestList,
    setNewCreatorFilter,
    getDataForContest,
    addContestType,
    removeContestType
} from '../../actions/actionCreator';
import ContestsContainer from '../ContestsContainer/ContestsContainer';
import ContestBox from "../ContestBox/ContestBox";
import styles from './CreatorDashboard.module.sass';
import queryString from 'query-string';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import TryAgain from '../../Components/TryAgain/TryAgain';



const types = ['name,tagline,logo', 'name', 'tagline', 'logo', 'name,tagline', 'logo,tagline', 'name,logo'];


class CreatorDashboard extends React.Component {


    renderSelectType = () => {
        // const array = [];
        // const {creatorFilter} = this.props;

        const {addContestTypeToFilter} = this.props;
        console.log(addContestTypeToFilter);
        //types.forEach((el, i) => !i || array.push(<option key={i - 1} value={el}>{el}</option>));
        return (
            <select onChange={e => {
                addContestTypeToFilter(e.currentTarget.value)
            }}>
                <option value="" selected>Select </option>
                    {
                        types.map((choice) => {
                            return (
                                <option key={choice} value={choice}>
                                    {
                                        choice
                                    }
                                </option>
                            )
                        })
                    }

            </select>
        );
    };

    renderIndustryType = () => {
        const array = [];
        const {creatorFilter} = this.props;

        const {industry} = this.props.dataForContest.data ? this.props.dataForContest.data : ['1','2','3'];
        array.push(<option key={0} value={null}>Choose industry</option>);
        industry.forEach((industry, i) => array.push(<option key={i + 1} value={industry}>{industry}</option>));
        return (
            <select onChange={({target}) => this.changePredicate({
                name: 'industry',
                value: target.value
            })} value={creatorFilter.industry} className={styles.input}>
                {array}
            </select>
        );
    };

    Badge = () => {
        const {creatorFilter:{selectedContestsTypes}, removeContestTypeFromFilter} = this.props
        return(
            <span>
                {selectedContestsTypes.map((choice) => (
                    <button className="" key={choice} value={choice} onClick={(e) => {
                        e.preventDefault()
                        removeContestTypeFromFilter(e.currentTarget.value)
                    }
                    }>
                        {
                            choice
                        }
                    </button>
                ))}
            </span>
        )
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.location.search !== this.props.location.search) {
            this.parseUrlForParams(nextProps.location.search);
        }
    }


    componentDidMount() {
        this.props.getDataForContest();
        if (this.parseUrlForParams(this.props.location.search) && !this.props.contests.length)
            this.getContests(this.props.creatorFilter);
    }

    getContests = (filter) => {
        this.props.getContests(Object.assign({}, {
            limit: 8,
            offset: 0
        }, filter));
    };

    changePredicate = ({name, value}) => {
        const {creatorFilter} = this.props;
        this.props.newFilter({[name]: value === 'Choose industry' ? null : value});
        this.parseParamsToUrl({...creatorFilter, ...{[name]: value === 'Choose industry' ? null : value}});
    };


    parseParamsToUrl = (creatorFilter) => {
        const obj = {};
        Object.keys(creatorFilter).forEach(el => {
            if (creatorFilter[el])
                obj[el] = creatorFilter[el];
        });
        this.props.history.push('/Dashboard?' + queryString.stringify(obj));
    };

    parseUrlForParams = (search) => {
        const obj = queryString.parse(search);
        const filter = {
            typeIndex: obj.typeIndex || 1,
            contestId: obj.contestId ? obj.contestId : '',
            industry: obj.industry ? obj.industry : '',
            awardSort: obj.awardSort || 'asc',
            ownEntries: typeof obj.ownEntries === "undefined" ? false : obj.ownEntries,
            selectedContestsTypes: obj.selectedContestsTypes || []
        };
        if (!isEqual(filter, this.props.creatorFilter)) {
            this.props.newFilter(filter);
            this.props.clearContestsList();
            this.getContests(filter);
            return false;
        } else
            return true;
    };

    getPredicateOfRequest = () => {
        const obj = {};
        const {creatorFilter} = this.props;
        Object.keys(creatorFilter).forEach((el) => {
            if (creatorFilter[el]) {
                obj[el] = creatorFilter[el];
            }
        });
        obj.ownEntries = creatorFilter.ownEntries;
        return obj;
    };

    loadMore = (startFrom) => {
        this.props.getContests(Object.assign({}, {
            limit: 8,
            offset: startFrom
        }, this.getPredicateOfRequest()));
    };

    setContestList = () => {
        const array = [];
        const {contests} = this.props;
        for (let i = 0; i < contests.length; i++) {
            array.push(<ContestBox data={contests[i]} key={contests[i].id}
                                   goToExtended={this.goToExtended}/>)
        }
        return array;
    };

    goToExtended = (contestId) => {
        this.props.history.push('/contest/' + contestId);
    };

    tryLoadAgain = () => {
        this.props.clearContestsList();
        this.props.getContests({limit: 8, offset: 0, ...this.getPredicateOfRequest()});
    };


    render() {
        const {error, haveMore, creatorFilter} = this.props;
        const {isFetching} = this.props.dataForContest;
        return (
            <div className={styles.mainContainer}>
                <div className={styles.filterContainer}>
                    <span className={styles.headerFilter}>Filter Results</span>
                    <div className={styles.inputsContainer}>
                        <div
                            onClick={() => this.changePredicate({name: 'ownEntries', value: !creatorFilter.ownEntries})}
                            className={classNames(styles.myEntries, {[styles.activeMyEntries]: creatorFilter.ownEntries})}>My
                            Entries
                        </div>
                        <div className={styles.inputContainer}>
                            <span>By contest type</span>
                            {this.renderSelectType()}
                        </div>
                        <div className={styles.inputContainer}>
                            <span>By contest ID</span>
                            <input type="text" onChange={({target}) => this.changePredicate({
                                name: 'contestId',
                                value: target.value
                            })} name='contestId'
                                   value={creatorFilter.contestId} className={styles.input}/>
                        </div>
                        {!isFetching && <div className={styles.inputContainer}>
                            <span>By industry</span>
                            {/*{this.renderIndustryType()}*/}
                        </div>}
                        <div className={styles.inputContainer}>
                            <span>By amount award</span>
                            <select onChange={({target}) => this.changePredicate({
                                name: 'awardSort',
                                value: target.value
                            })} value={creatorFilter.awardSort} className={styles.input}>
                                <option value='desc'>Descending</option>
                                <option value='asc'>Ascending</option>
                            </select>
                        </div>
                        <Link to='transactions' className={styles.btn}>
                            Transactions history
                        </Link>
                    </div>
                </div>
                {
                    error ?
                        <div className={styles.messageContainer}>
                            <TryAgain getData={this.tryLoadAgain}/>
                        </div>
                        :
                        <ContestsContainer isFetching={this.props.isFetching}
                                           loadMore={this.loadMore}
                                           history={this.props.history} haveMore={haveMore}>
                            {this.setContestList()}
                        </ContestsContainer>
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    const {contestsList, dataForContest} = state;
    return {...contestsList, dataForContest};
};

const mapDispatchToProps = (dispatch) => {
    return {
        getContests: (data) => dispatch(getContestsForCreative(data)),
        clearContestsList: () => dispatch(clearContestList()),
        newFilter: (filter) => dispatch(setNewCreatorFilter(filter)),
        getDataForContest: () => dispatch(getDataForContest()),
        addContestTypeToFilter: () => dispatch(addContestType()),
        removeContestTypeFromFilter: () => dispatch(removeContestType())
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatorDashboard));