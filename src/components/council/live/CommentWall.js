import React from 'react';
import { Drawer } from 'material-ui';
import { graphql } from 'react-apollo';
import { darkGrey, lightGrey, getPrimary, getSecondary } from '../../../styles/colors';
import { wallComments } from '../../../queries';
import { Icon, Grid, GridItem, LoadingSection } from '../../../displayComponents';
import moment from 'moment';
import Scrollbar from 'react-perfect-scrollbar';

const CommentWall = ({ data, translate, open, requestClose }) => {

    return(
        <Drawer style={{zIndex: -1, width: '300px'}} anchor="right" variant="persistent" open={open} onClose={requestClose}>
            <div
                style={{
                    height: '100%',
                    width: '300px',
                    paddingTop: '3em',
                    overflow: 'hidden'
                }}
            >
                <div 
                    style={{display: 'flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '0.8em', fontSize: '0.90rem', width: '100%', height: '3.5em', backgroundColor: darkGrey, textTransform: 'uppercase', color: 'grey'}}
                    onClick={requestClose}
                >
                    {translate.wall}
                    <Icon
                        className="material-icons"
                        style={{color: 'grey', marginRight: '1.1em'}}
                    >
                        keyboard_arrow_right
                    </Icon>
                </div>
                {data.loading?
                    <LoadingSection />

                :
                    <div style={{width: '100%', height: '100%', overflow: 'hidden', paddingBottom: '3em', position: 'relative'}}>
                        <Scrollbar option={{suppressScrollX: true}}>
                            {data.councilRoomMessages.map((comment) => (
                                <div key={`comment_${comment.id}`} style={{fontSize: '0.85rem', padding: '1em 0.8em', backgroundColor: comment.participantId === -1? lightGrey : 'transparent'}}>
                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <div>
                                            {comment.author?
                                                <span style={{fontWeight: '700', color: getPrimary()}}>{`${comment.author.name} ${comment.author.surname} - ${comment.author.position}`}</span>
                                            :
                                                <span style={{fontWeight: '700', color: getSecondary()}}>Room</span>
                                            }
                                        </div>
                                        <div>
                                            {moment(comment.date).format('HH:mm')}
                                        </div>
                                    </div>
                                    {comment.text}
                                </div>
                            ))}
                        </Scrollbar>
                    </div>
                }
            </div>
        </Drawer>
    );
}

export default graphql(wallComments, {
    options: (props) => ({
        variables: {
            councilId: props.council.id,
        },
        pollInterval: 5000
    })
})(CommentWall);