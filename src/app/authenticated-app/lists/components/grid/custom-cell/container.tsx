import React, { forwardRef, useImperativeHandle } from 'react';
import { RootState } from '../../../../../../root';
import { connect } from 'react-redux';
import { CustomCellComponent } from './component';

const mapStateToProps = (state: RootState) => ({
  columns: state.lists.columns,
});

const connector = connect(mapStateToProps, {}, null, { forwardRef: true });

const CustomCellContainer = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({}));
  return <CustomCellComponent {...props} />;
});

export const CustomCell = connector(CustomCellContainer);
