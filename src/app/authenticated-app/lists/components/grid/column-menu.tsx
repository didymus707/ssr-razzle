import React, { useEffect, useState, useRef } from 'react';
import { Box, Input, useDisclosure, useToast } from '@chakra-ui/core';
import { motion } from 'framer-motion';
import { PopoverWrapper } from '../../list-view.styles';
import { ToastBox } from 'app/components';
import { PopoverListItem } from '../popover-list-item';
import { PropertySelect } from './property/property-select';
import { customizable_properties } from '../../list.data';
import { getColumnCustomizationComponent } from '../../lists.utils';
import { EnrichConfirmationModal } from '../enrich-confirmation-modal';

export const GridColumnMenu = (props: any) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [enrichLoading, setEnrichLoading] = useState<boolean>(false);
  const { parent_type = 'grid' } = props;

  const [stage, setStage] = useState('property');

  const already_enriched: boolean = !!Object.values(props.columns).find(
    (i: any) => i.type === 'DND' && i.customization.tracked_column === props.column?.id,
  );

  const {
    isOpen: isEnrichDialogOpen,
    onOpen: openEnrichDialog,
    onClose: closeEnrichDialog,
  } = useDisclosure();

  const container = useRef();

  const toast = useToast();

  const [tempLabel, setTempLabel] = useState('');
  const [headerPosition, setHeaderPosition] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const col_id = props.columnID;

  const fetchHeaderPosition = () => {
    const column_header_element = document.querySelectorAll(`[col-id="${col_id}"]`)[0];
    if (!column_header_element) return;
    const rect = column_header_element.getBoundingClientRect();
    setHeaderPosition({
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    });
  };

  const fetchFieldPosition = () => {
    const { field_position: rect } = props;
    setHeaderPosition({
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    });
  };

  const handleTempLabelChange = (event: any) => {
    const value = event.target.value;
    setTempLabel(value);
  };

  const handleClick = (e: any) => {
    const enrich_dialog_element = document.getElementById('enrich-modal');

    // @ts-ignore
    if (container.current.contains(e.target) || !props.isOpen) return;
    if (tempLabel !== props.column.label) props.updateLabel(col_id, tempLabel);
    if (enrich_dialog_element) {
      // @ts-ignore
      if (enrich_dialog_element.contains(e.target) || !props.isOpen) return;
    }
    props.close();
  };

  const handleEnterPressed = (e: any) => {
    if (e.key !== 'Enter') return;
    if (tempLabel === props.column.label) props.close();
    props.updateLabel(col_id, tempLabel);
    props.close();
  };

  const attachOutsideClickListener = () => {
    document.addEventListener('mousedown', handleClick);
  };
  const detachOutsideClickListener = () => {
    document.removeEventListener('mousedown', handleClick);
  };

  const attachEnterPressedListener = () => {
    const input_element = document.getElementById('col-label-input');
    if (!input_element) return;
    input_element.addEventListener('keydown', handleEnterPressed);
  };

  const detachEnterPressedListener = () => {
    const input_element = document.getElementById('col-label-input');
    if (!input_element) return;
    input_element.removeEventListener('keydown', handleEnterPressed);
  };

  const handleTypeChanged = (type: string) => {
    const payload = {
      type,
      label: tempLabel,
    };
    props.updateColumn(col_id, payload);
    setStage('property');
    if (type !== 'DATE') props.close();
  };

  const handleEnrichProceed = async () => {
    setEnrichLoading(true);
    const res = await props.enrichColumnData(props.column.id);
    setEnrichLoading(false);
    if (res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Phone number enrichment started successfully"
          />
        ),
      });
      return props.close();
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="error"
            onClose={onClose}
            message="Unable to start phone number enrichment, please try again"
          />
        ),
      });
    }
  };

  const CustomizationComponent: React.ReactNode = getColumnCustomizationComponent(
    props?.column?.type,
  );

  useEffect(() => {
    if (parent_type === 'grid' && props.isOpen) {
      fetchHeaderPosition();
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.columnID]);

  useEffect(() => {
    if (parent_type === 'field' && props.isOpen) {
      fetchFieldPosition();
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  useEffect(() => {
    setStage('property');
    attachOutsideClickListener();
    return detachOutsideClickListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen, tempLabel]);

  useEffect(() => {
    attachEnterPressedListener();
    return detachEnterPressedListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen, tempLabel]);

  useEffect(() => {
    if (props.column) setTempLabel(props.column.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.column]);

  const left_overflow =
    parent_type === 'field' ? 0 : window.innerWidth - (headerPosition.left + 280);

  useEffect(() => {
    closeEnrichDialog();
    if (!props.isOpen) setInitialized(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  let animateProps = {};

  if (parent_type !== 'field') {
    animateProps = {
      initial: { opacity: 0, scaleY: 0.5, y: -50 },
      animate: { opacity: 1, scaleY: 1, y: 0 },
      transition: { type: 'spring', duration: 0.005, stiffness: 460, damping: 30 },
    };
  }

  return (
    <Box
      width="240px"
      zIndex={1000000000000}
      boxShadow="none"
      position="absolute"
      left={
        parent_type === 'field'
          ? headerPosition.left - 600
          : headerPosition.left + Math.min(left_overflow, 5)
      }
      top={parent_type === 'field' ? headerPosition.bottom - 80 : headerPosition.bottom - 60}
      ref={container}
      onContextMenu={event => {
        event.preventDefault();
        return false;
      }}
    >
      {props.isOpen && initialized && (
        <motion.div {...animateProps}>
          <PopoverWrapper position="fixed" zIndex={1000000000}>
            <Box className="input-item" width="auto" style={{ width: 'auto' }}>
              <Input
                value={tempLabel}
                onChange={handleTempLabelChange}
                variant="filled"
                height={30}
                fontSize={13}
                isInvalid={tempLabel.length === 0}
                id="col-label-input"
                style={{
                  backgroundColor: '#EDF2F7',
                }}
                isFullWidth
                autoFocus
              />
            </Box>

            <div className="property-type-label">PROPERTY TYPE</div>
            <PropertySelect
              column={props.column}
              onChange={handleTypeChanged}
              disabled={props.column?.type === 'DND'}
            />

            {stage === 'property' && (
              <>
                <hr />
                {customizable_properties.includes(props?.column?.type) && (
                  <PopoverListItem
                    label="Customize field"
                    icon="settings"
                    onClick={() => setStage('customize')}
                  />
                )}
                {props.column?.type === 'PHONE NUMBER' && (
                  <>
                    {!already_enriched ? (
                      <PopoverListItem
                        label="Enrich data"
                        icon="premium"
                        onClick={openEnrichDialog}
                      />
                    ) : (
                      <PopoverListItem
                        color="green"
                        label="Refresh enriched data"
                        icon="premium"
                        onClick={openEnrichDialog}
                      />
                    )}

                    <EnrichConfirmationModal
                      isOpen={isEnrichDialogOpen}
                      isLoading={enrichLoading}
                      onClose={closeEnrichDialog}
                      onProceed={handleEnrichProceed}
                    />
                  </>
                )}

                {props.hideColumn && (
                  <PopoverListItem
                    label="Hide field"
                    icon="view-off"
                    onClick={() => props.hideColumn(col_id)}
                  />
                )}
                {props.deleteColumn && (
                  <PopoverListItem
                    label="Delete field"
                    icon="trash"
                    onClick={() => props.deleteColumn(col_id)}
                  />
                )}
              </>
            )}
            {stage === 'customize' && (
              // @ts-ignore
              <CustomizationComponent
                columns={props.columns}
                column={props.column}
                updateCustomization={props.updateCustomization}
                close={props.close}
              />
            )}
          </PopoverWrapper>
        </motion.div>
      )}
    </Box>
  );
};
