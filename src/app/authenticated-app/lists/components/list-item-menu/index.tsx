import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Icon, Input, SimpleGrid, Box, useToast } from '@chakra-ui/core';
import { ListItemMenuWrapper as Wrapper } from './index.styles';
import { list_option_colors } from '../../list.data';
import { List, Position, SmartList } from '../../lists.types';
import { ConfirmModal, ToastBox } from '../../../../components';
import { useSelector } from 'react-redux';
import { selectActiveSubscription } from '../../../settings';
import { selectListCount } from '../../lists.selectors';
import { icons } from 'feather-icons';

export const icon_options: { [index: string]: any } = Object.keys(icons).reduce(
  (acc, i) => ({
    ...acc,
    [i]: `${icons[i].toSvg()}`,
  }),
  {},
);

interface IconSelectProps {
  handleIconChange: Function;
  selected_icon: string;
  selected_color: string;
}

const IconSelect = (props: IconSelectProps) => {
  return (
    <SimpleGrid minChildWidth="18px" spacing="5px" className="icon-select-section">
      {Object.keys(icon_options).map((i: string) => {
        const icon_color = i === props.selected_icon ? 'white' : 'grey';
        const icon_src = `data:image/svg+xml;utf8,${icon_options[i].replace(
          'currentColor',
          icon_color,
        )}`;

        return (
          <Box
            key={i}
            onClick={() => props.handleIconChange(i)}
            className="icon"
            bg={i === props.selected_icon ? props.selected_color : 'initial'}
          >
            <img alt="" src={icon_src} />
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

interface Props {
  close: Function;
  updateList: Function;
  deleteList: Function;
  restoreList: Function;
  deleteListPermanently: Function;
  markListFavorite: Function;
  unMarkListFavorite: Function;
  targetPosition: Position;
  initialData: List | SmartList | null;
  is_smart_list: boolean;
  is_initial_list: boolean;
  is_favorite: boolean;
  is_trash: boolean;
  show: boolean;
  openNoSubscriptionModal: Function;
}

export const ListItemMenu = (props: Props) => {
  const [tempData, setTempData] = useState<List | SmartList | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showRestoreDialog, setShowShowRestoreDialog] = useState<boolean>(false);
  const [showPermanentlyDeleteDialog, setShowPermanentlyDeleteDialog] = useState<boolean>(false);

  const containerRef = useRef(null);

  const active_subscription: any = useSelector(selectActiveSubscription);
  const lists_count = useSelector(selectListCount);

  let allow_restore: boolean = false;
  if (!active_subscription?.details?.lists?.lists) allow_restore = true;
  else if (active_subscription.details.lists.lists > lists_count) allow_restore = true;

  const handleRestoreOptionClicked = () => {
    if (allow_restore) setShowShowRestoreDialog(true);
    else
      props.openNoSubscriptionModal({
        heading: "Oops, looks like you've run out of available lists on your subscription",
        subHeading:
          'Upgrade to our business plan to restore deleted lists and create unlimited lists',
      });
  };

  const toast = useToast();

  const onInputLabelEnterPressed = (event: any) => {
    if (event.key !== 'Enter') return;
    const updated_label = event.target.value;
    props.updateList(tempData?.id, {
      name: updated_label,
    });
    props.close();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updated_label = event.target.value;
    // @ts-ignore
    setTempData({
      ...tempData,
      name: updated_label,
    });
  };

  const handleColorChange = (color: string) => {
    // @ts-ignore
    setTempData({
      ...tempData,
      color,
    });
    props.updateList(tempData?.id, {
      color,
    });
  };

  const handleIconChange = (icon: string) => {
    // @ts-ignore
    setTempData({
      ...tempData,
      icon,
    });
    props.updateList(tempData?.id, {
      icon,
    });
  };

  const handleClick = (e: MouseEvent) => {
    if (!containerRef?.current) return;
    // @ts-ignore
    if (containerRef.current.contains(e.target) || !props.show) return;
    if (tempData?.name !== props.initialData?.name) {
      props.updateList(tempData?.id, { name: tempData?.name });
    }
    props.close();
  };

  const attachOutsideClickListener = () => {
    if (showDeleteDialog) return;
    if (showRestoreDialog) return;
    if (showPermanentlyDeleteDialog) return;
    document.addEventListener('mousedown', handleClick);
  };
  const detachOutsideClickListener = () => {
    document.removeEventListener('mousedown', handleClick);
  };

  const tempName = tempData?.name;

  useEffect(() => {
    attachOutsideClickListener();
    return detachOutsideClickListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show, tempName, showDeleteDialog, showPermanentlyDeleteDialog, showRestoreDialog]);

  // @ts-ignore
  const selected_icon = icon_options[tempData?.icon || '']
    ? tempData?.icon || 'database'
    : 'database';
  const selected_color = tempData?.color || 'rgba(15,15,15, 0.8)';

  const { targetPosition } = props;

  useEffect(() => {
    if (props.initialData) {
      setTempData(props.initialData);
    }
  }, [props.initialData]);

  const handleDeleteList = () => {
    setShowDeleteDialog(false);
    if (!tempData) return;
    const list_id = tempData['id'];
    props.deleteList(list_id);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          status="success"
          onClose={onClose}
          message={
            props.is_smart_list
              ? `${tempData['name']} smart list deleted`
              : `${tempData['name']} list moved to trash`
          }
        />
      ),
    });
    props.close();
  };

  const handleDeleteListPermanently = () => {
    setShowPermanentlyDeleteDialog(false);
    if (!tempData) return;
    const list_id = tempData['id'];
    props.deleteListPermanently(list_id);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          status="success"
          onClose={onClose}
          message={`${tempData['name']} list deleted permanently`}
        />
      ),
    });
    props.close();
  };

  const handleRestoreList = () => {
    setShowShowRestoreDialog(false);
    if (!tempData) return;
    const list_id = tempData['id'];
    props.restoreList(list_id);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          status="success"
          onClose={onClose}
          message={`${tempData['name']} list restored from trash`}
        />
      ),
    });
    props.close();
  };

  const handleMarkFavorite = () => {
    if (!tempData) return;
    const list_id = tempData['id'];
    props.markListFavorite(list_id);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          status="success"
          onClose={onClose}
          message={`${tempData['name']} list marked as favorite`}
        />
      ),
    });
    props.close();
  };

  const handleUnmarkFavorite = () => {
    if (!tempData) return;
    const list_id = tempData['id'];
    props.unMarkListFavorite(list_id);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          status="success"
          onClose={onClose}
          message={`${tempData['name']} list unmarked as favorite`}
        />
      ),
    });
    props.close();
  };

  useEffect(() => {
    if (!props.show) {
      setShowDeleteDialog(false);
      setShowPermanentlyDeleteDialog(false);
      setShowShowRestoreDialog(false);
    }
  }, [props.show]);

  const left_overflow = window.innerWidth - (targetPosition.left - 100 + 265);
  const top_overflow = window.innerHeight - (targetPosition.top - 50 + 400);

  if (props.show && tempData)
    return (
      <>
        <Wrapper
          style={{
            left: targetPosition.left - 100 + Math.min(left_overflow, 5),
            top: targetPosition.bottom - 50 + Math.min(top_overflow, 0),
          }}
          ref={containerRef}
        >
          {!props.is_trash && (
            <>
              <Input
                className="label-input"
                variant="filled"
                _focus={{
                  boxShadow: 'none',
                  outline: 'none',
                }}
                value={tempData?.name}
                onChange={handleInputChange}
                onKeyPress={onInputLabelEnterPressed}
                autoFocus
                style={{
                  marginBottom: props.is_smart_list ? '0px' : '10px',
                }}
              />

              {!props.is_smart_list && (
                <SimpleGrid columns={9} spacing="3px">
                  {list_option_colors.map((i: string) => (
                    <Box
                      key={i}
                      bg={i}
                      onClick={() => handleColorChange(i)}
                      className="color-option"
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {tempData?.color === i && <Icon name="check" size="10px" color="white" />}
                    </Box>
                  ))}
                </SimpleGrid>
              )}

              <IconSelect
                selected_icon={selected_icon}
                selected_color={selected_color}
                handleIconChange={(icon: string) => {
                  handleIconChange(icon);
                }}
              />

              <hr />

              {!props.is_smart_list && (
                <>
                  {!props.is_favorite ? (
                    <div
                      className="action-item"
                      onClick={() => handleMarkFavorite()}
                      style={{ color: '#333333' }}
                    >
                      <Icon name="star" marginRight="10px" />
                      Mark favorite
                    </div>
                  ) : (
                    <div
                      className="action-item"
                      onClick={() => handleUnmarkFavorite()}
                      style={{ color: '#333333' }}
                    >
                      <Icon name="star" marginRight="10px" />
                      Unmark favorite
                    </div>
                  )}
                </>
              )}

              <div className="action-item" onClick={() => setShowDeleteDialog(true)}>
                <Icon name="trash" marginRight="10px" />
                Delete{props.is_smart_list ? ' smart list' : ' list'}
              </div>
            </>
          )}

          {props.is_trash && (
            <>
              <div
                className="action-item"
                onClick={handleRestoreOptionClicked}
                style={{
                  color: '#333333',
                  fontSize: 12,
                  paddingTop: 3,
                  paddingBottom: 3,
                }}
              >
                <Icon name="repeat-clock" marginRight="10px" />
                Restore list
              </div>
              <div
                className="action-item"
                onClick={() => setShowPermanentlyDeleteDialog(true)}
                style={{
                  fontSize: 12,
                  paddingTop: 3,
                  paddingBottom: 3,
                }}
              >
                <Icon name="trash" marginRight="10px" />
                Delete permanently
              </div>
            </>
          )}
        </Wrapper>
        <ConfirmModal
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          title={`Delete ${props.is_smart_list ? 'smart' : ''} list`}
          description={
            !props.is_smart_list
              ? `We'll move this list to your trash for 30days`
              : `This smart list would be permanently deleted and this action is irreversible`
          }
          onConfirm={handleDeleteList}
          hidePrompt
        />
        <ConfirmModal
          isOpen={showPermanentlyDeleteDialog}
          onClose={() => setShowPermanentlyDeleteDialog(false)}
          title="Delete list permanently"
          description="This list can't be retrieved and all data would be lost after permanent deletion"
          onConfirm={handleDeleteListPermanently}
          hidePrompt
        />
        <ConfirmModal
          isOpen={showRestoreDialog}
          onClose={() => setShowShowRestoreDialog(false)}
          title="Restore deleted list"
          description="All information in this list would be made accessible and would count towards your current subscription list allowance"
          onConfirm={handleRestoreList}
          hidePrompt
        />
      </>
    );
  return <></>;
};
