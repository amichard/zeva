import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CustomPropTypes from '../../app/utilities/props';
import history from '../../app/History';
import SalesListTable from './SalesListTable';

const SalesSubmissionDetailsPage = (props) => {
  const {
    handleCheckboxClick,
    handleSubmit,
    submission,
    user,
    validatedList,
  } = props;

  const [filtered, setFiltered] = useState([]);
  const filterWarnings = () => {
    setFiltered([...filtered, { id: 'warning', value: '1' }]);
  };

  const clearFilters = () => {
    setFiltered([]);
  };

  const showWarnings = submission.content.some((row) => (row.warnings.length > 0));

  const actionBar = (
    <div className="action-bar">
      <span className="left-content">
        <button
          className="button"
          onClick={() => {
            history.goBack();
          }}
          type="button"
        >
          <FontAwesomeIcon icon="arrow-left" /> Back
        </button>
      </span>
      <span className="right-content">
        <button
          className="button"
          type="button"
          onClick={() => { clearFilters(); }}
        >
          Clear Filter
        </button>
        <button
          className="button btn btn-outline-danger"
          type="button"
          onClick={() => { filterWarnings(); }}
        >
          View Warnings Only
        </button>
        <button
          className="button primary"
          onClick={() => {
            handleSubmit();
          }}
          type="button"
        >
          <FontAwesomeIcon icon="save" /> Save
        </button>
      </span>
    </div>
  );

  return (
    <div id="sales-details" className="page">
      <div className="row">
        <div className="col-sm-12">
          <h1>{submission.organization && `${submission.organization.name} `}</h1>
          <h2 className="my-0 py-0">ZEV Sales Submission {submission.submissionDate}</h2>
        </div>
      </div>

      {showWarnings && (
      <div className="row">
        <div className="col-sm-12 mt-3">
          <strong>warnings found </strong>
          &mdash; warning codes:{' '}
          11 = no matching ICBC data;{' '}
          21 = credits already issued to VIN;{' '}
          31 = VIN contains duplicates;{' '}
          41 = unmatched data;{' '}
          51 = retail sales date and registration date greater than 3 months apart;{' '}
          61 = invalid make, model and year combination;{' '}
          71 = invalid date
        </div>
      </div>
      )}

      <div className="row">
        <div className="col-sm-12">
          {actionBar}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <SalesListTable
            handleCheckboxClick={handleCheckboxClick}
            items={submission.content}
            submission={submission}
            user={user}
            validatedList={validatedList}
            filtered={filtered}
            setFiltered={setFiltered}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 mt-3">
          {actionBar}
        </div>
      </div>
    </div>
  );
};

SalesSubmissionDetailsPage.defaultProps = {};

SalesSubmissionDetailsPage.propTypes = {
  handleCheckboxClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submission: PropTypes.shape().isRequired,
  user: CustomPropTypes.user.isRequired,
  validatedList: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])).isRequired,
};

export default SalesSubmissionDetailsPage;