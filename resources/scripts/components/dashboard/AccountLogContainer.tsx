import tw from 'twin.macro';
import { Actions } from 'easy-peasy';
import * as Icon from 'react-feather';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { useStoreActions } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import GreyRowBox from '@/components/elements/GreyRowBox';
import ContentBox from '@/components/elements/ContentBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import getAccountLogs, { AccountLog } from '@/api/account/getAccountLogs';

const AccountLogContainer = () => {
    const [ loading, setLoading ] = useState(false);
    const [ logs, setLogs ] = useState<AccountLog[]>([]);

    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    useEffect(() => {
        clearFlashes('account:logs');
        getAccountLogs()
            .then(logs => setLogs(logs))
            .then(() => setLoading(false))
            .catch(error => {
                console.error(error);
                addError({ key: 'account:logs', message: httpErrorToHuman(error) });
            });
    }, []);

    return (
        <ContentBox css={tw`flex-1 overflow-hidden mt-8 md:mt-0 md:ml-8`}>
            <FlashMessageRender byKey={'account:notifications'} css={tw`mb-2`} />
            {
                logs.length === 0 ?
                    <p css={tw`text-center text-sm`}>
                        {loading ? <Spinner size={'large'} centered /> : 'You do not have any account logs.'}
                    </p>
                    :
                    logs.map((log, index) => (
                        <GreyRowBox
                            key={log.id}
                            css={[ tw`bg-neutral-850 flex items-center`, index > 0 && tw`mt-2` ]}
                        >
                            <p css={tw`text-lg ml-4 md:block`}>
                                <Icon.Info /> Audit #{log.id}
                            </p>
                            <p css={tw`text-sm ml-4 md:block`}>
                                Action:&nbsp;
                                <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded mr-2`}>
                                    {log.action}
                                </code>
                            </p>
                            <p css={tw`text-sm ml-4 hidden md:block`}>
                                IP address:&nbsp;
                                <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded mr-2`}>
                                    {log.ipAddress}
                                </code>
                            </p>
                        </GreyRowBox>
                    ))
            }
        </ContentBox>
    );
};

export default AccountLogContainer;
