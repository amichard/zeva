/*
 * Presentational component
 */
import PropTypes from 'prop-types';
import React from 'react';
import ReactTable from 'react-table';

import history from '../../app/History';

const VehicleListTable = (props) => {
  const { items, user, handleCheckboxClick } = props;
  const columns = [{
    accessor: (row) => (row.make ? row.make.name : ''),
    Header: 'Make',
    id: 'make',
    width: 150,
  }, {
    accessor: (row) => (row.modelName ? row.modelName : ''),
    Header: 'Model',
    id: 'model',
  }, {
    accessor: (row) => (row.modelYear ? row.modelYear.name : ''),
    className: 'text-center',
    Header: 'Model Year',
    id: 'col-my',
    width: 125,
  }, {
    accessor: (row) => (row.vehicleFuelType.vehicleFuelCode === 'B'
      ? 'Battery Electric Vehicle (BEV)'
      : 'Plug-in Hybrid Electric Vehicle (PHEV)'
    ),
    Header: 'ZEV Type',
    id: 'zev-type',
    width: 325,
  }, {
    accessor: 'range',
    className: 'text-right',
    Header: 'Range (km)',
    id: 'range',
    width: 125,
  }, {
    accessor: (row) => {
      let variable = 0.3;

      if (row.vehicleFuelType.vehicleFuelCode === 'B') {
        variable = 0.5;
      }

      let credit = ((row.range * 0.006214) + variable).toFixed(2);

      if (credit > 4) {
        credit = 4;
      }

      return credit;
    },
    className: 'text-right',
    Header: 'Credit',
    id: 'col-credit',
    width: 125,
  }, {
    accessor: (row) => {
      if (row.vehicleFuelType.vehicleFuelCode === 'B') {
        if (row.range < 80.47) {
          return 'C';
        }

        return 'A';
      }

      if (row.range < 16) {
        return 'C';
      }

      return 'B';
    },
    className: 'text-center',
    Header: 'Class',
    id: 'col-class',
    width: 125,
  }, {
    accessor: 'validationStatus',
    className: 'text-center',
    Header: 'Status',
    id: 'col-status',
    width: 175,
  }, {
    accessor: (row) => (row.validationStatus === 'VALIDATED' ? <input type="checkbox" defaultChecked disabled /> : <input type="checkbox" value={row.id} onChange={(event) => { handleCheckboxClick(event); }} />),
    className: 'text-center',
    Header: 'Validate',
    id: 'col-validated',
    show: user.isGovernment,
    width: 125,
  }];

  const filterMethod = (filter, row) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id])
      .toLowerCase()
      .includes(filter.value.toLowerCase()) : true;
  };
  const filterable = true;

  return (
    <ReactTable
      className="searchable"
      columns={columns}
      data={items}
      defaultFilterMethod={filterMethod}
      defaultPageSize={items.length}
      defaultSorted={[{
        id: 'make',
      }]}
      filterable={filterable}
      getTrProps={(state, row) => {
        if (row && row.original && !user.isGovernment) {
          return {
            onClick: () => {
              const { id } = row.original;
              history.push(`/vehicles/${id}`);
            },
            className: 'clickable',
          };
        }

        return {};
      }}
      pageSizeOptions={[items.length, 5, 10, 15, 20, 25, 50, 100]}
    />
  );
};

VehicleListTable.defaultProps = {};

VehicleListTable.propTypes = {
  handleCheckboxClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })).isRequired,
  user: PropTypes.shape({
    isGovernment: PropTypes.bool,
  }).isRequired,
};

export default VehicleListTable;
