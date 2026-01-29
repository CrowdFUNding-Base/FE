import WithdrawPage from "@/modules/campaign/withdraw/WithdrawPage";

interface WithdrawPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Withdraw({ params }: WithdrawPageProps) {
    const { id } = await params;
    return(
        <WithdrawPage campaignId={id} />
    )
}
