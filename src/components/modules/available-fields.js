import React, { Fragment }            from 'react'; // eslint-disable-line
import PropTypes                      from 'prop-types';
import { bindActionCreators }         from 'redux';
import { connect }                    from 'react-redux';
import { groupBy, orderBy, sortBy }   from 'lodash';
import FIELD_OPTIONS                  from '../../data/fields';
import Accordion                      from '../uswds/accordion';
import Checkbox                       from '../uswds/checkbox';
import AvailableField                 from '../available-field';
import {
    selectField, unselectField, setFieldValue,
}                                     from '../../redux/ducks/selectedFields';
import FIELD_CATEGORY_ORDER           from '../../data/field-category-order';

const AvailableFields = (props) => {
    const availableGroups = selectedFields => groupBy(selectedFields, 'category');
    const groups = availableGroups(props.availableFields);
    const sortedGroupKeys = sortBy(Object.keys(groups), key => FIELD_CATEGORY_ORDER[key]);
    const sanitizeField = field => ({
        ...field,
        input_options: undefined,
    })
    const handleOnFieldChange = (field, e) => {
        props.actions.setFieldValue({
            ...sanitizeField(field),
            value: e.target.value.trim(),
        });
        !e.target.value.trim().length && props.actions.unselectField(field);
    }
    const groupAllChecked = (groupName) => {
        const filterByGroup = field => field.category === groupName;
        return Object.values(props.selectedFields).filter(filterByGroup).length ===
            Object.values(props.availableFields).filter(filterByGroup).length;
    }
    const items = sortedGroupKeys.map(key => ({
        id: groups[key][0].category,
        heading: groups[key][0].category,
        content: <Fragment>
            { orderBy(groups[key], ['order'], ['asc']).map(field => (
                <AvailableField
                    key={field.attribute}
                    field={field}
                    checked={!!props.selectedFields[field.attribute]}
                    onFieldChange={(e) => handleOnFieldChange(field, e) }
                />
            )) }
        </Fragment>,
    }));
    return (
        <div>
            <h2 className='margin-left-2'>
                Filters
            </h2>
            <Accordion items={items} defaultExpandedId='Website' />
        </div>
    );
};

AvailableFields.propTypes = {
    availableFields: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string,
        attribute: PropTypes.string,
        title: PropTypes.string,
        order: PropTypes.number,
    })),
    selectedFields: PropTypes.objectOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        attribute: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    })).isRequired,
};

AvailableFields.defaultProps = {
    availableFields: Object.values(FIELD_OPTIONS).filter(field => field.live),
}

const mapStateToProps = (state) => ({
    selectedFields: state.selectedFields,
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        selectField,
        unselectField,
        setFieldValue,
    }, dispatch)
});

const areStatesEqual = (prev, next) => (
    prev.selectedFields === next.selectedFields
);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { areStatesEqual },
)(AvailableFields);