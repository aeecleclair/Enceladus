import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CompetitionEditionStats } from "@/src/api/hyperionSchemas";
import { Users, CreditCard, Wallet, Trophy, Swords, Flag } from "lucide-react";

interface PaymentStatsCardProps {
  stats: CompetitionEditionStats;
}

const formatCents = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

const METHOD_LABELS: Record<string, string> = {
  manual: "Manuel",
  helloasso: "HelloAsso",
};

export const PaymentStatsCard = ({ stats }: PaymentStatsCardProps) => {
  const { users_stats, sports_stats, revenues_stats } = stats;

  const totalRevenue = revenues_stats.reduce((acc, r) => acc + r.total, 0);
  const totalTransactions = revenues_stats.reduce((acc, r) => acc + r.count, 0);

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Statistiques financières &amp; participants
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{users_stats.total_users}</p>
            <p className="text-xs text-muted-foreground mt-1">Total inscrits</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{users_stats.total_athletes}</p>
            <p className="text-xs text-muted-foreground mt-1">Athlètes</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{users_stats.total_pompoms}</p>
            <p className="text-xs text-muted-foreground mt-1">Pompoms</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{users_stats.total_fanfares}</p>
            <p className="text-xs text-muted-foreground mt-1">Fanfares</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{users_stats.total_cameramen}</p>
            <p className="text-xs text-muted-foreground mt-1">Caméramen</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{users_stats.total_volunteers}</p>
            <p className="text-xs text-muted-foreground mt-1">Bénévoles</p>
          </div>
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sport</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3 text-center">
              <div className="flex justify-center mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {sports_stats.total_participants}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Participants</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="flex justify-center mb-1">
                <Flag className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{sports_stats.total_teams}</p>
              <p className="text-xs text-muted-foreground mt-1">Équipes</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="flex justify-center mb-1">
                <Swords className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{sports_stats.total_matches}</p>
              <p className="text-xs text-muted-foreground mt-1">Matchs</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Revenus</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Total encaissé</p>
              </div>
              <p className="text-xl font-bold">{formatCents(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">
                {totalTransactions} transaction
                {totalTransactions !== 1 ? "s" : ""}
              </p>
            </div>
            {revenues_stats.map((revenue) => (
              <div key={revenue.method} className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {METHOD_LABELS[revenue.method] ?? revenue.method}
                  </p>
                </div>
                <p className="text-xl font-bold">
                  {formatCents(revenue.total)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {revenue.count} transaction{revenue.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
