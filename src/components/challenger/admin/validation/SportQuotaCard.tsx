// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/src/components/ui/card";
// import { Badge } from "@/src/components/ui/badge";
// import { Trophy, Users, CheckCircle, AlertCircle } from "lucide-react";
// import { Separator } from "@/src/components/ui/separator";
// import {
//   ParticipantDataTable,
//   ParticipantData,
// } from "@/src/components/admin/validation/ParticipantDataTable";
// import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
// import { useMemo } from "react";

// interface SportQuotaCardProps {
//   participants: ParticipantData[];
//   onValidateParticipant: (userId: string) => void;
//   isLoading: boolean;
//   schoolId: string;
//   schoolName: string;
// }

// export const SportQuotaCard = ({
//   participants,
//   onValidateParticipant,
//   isLoading,
//   schoolId,
//   schoolName,
// }: SportQuotaCardProps) => {

//   return (
//     <Card className="h-full">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <Trophy className="h-5 w-5" />
//             {sportName}
//           </CardTitle>
//           <div className="flex items-center gap-2">
//             {isOverQuota && (
//               <Badge variant="destructive" className="text-xs">
//                 <AlertCircle className="h-3 w-3 mr-1" />
//                 Quota participants dépassé
//               </Badge>
//             )}
//             {isTeamsOverQuota && (
//               <Badge variant="destructive" className="text-xs">
//                 <AlertCircle className="h-3 w-3 mr-1" />
//                 Quota équipes dépassé
//               </Badge>
//             )}
//             {!isOverQuota &&
//               totalParticipants === maxParticipants &&
//               maxParticipants > 0 && (
//                 <Badge variant="outline" className="text-xs">
//                   <CheckCircle className="h-3 w-3 mr-1" />
//                   Quota participants atteint
//                 </Badge>
//               )}
//             {!isTeamsOverQuota && uniqueTeams === maxTeams && maxTeams > 0 && (
//               <Badge variant="outline" className="text-xs">
//                 <CheckCircle className="h-3 w-3 mr-1" />
//                 Quota équipes atteint
//               </Badge>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div className="space-y-1">
//             <div className="flex items-center gap-2">
//               <Users className="h-4 w-4 text-muted-foreground" />
//               <span className="text-muted-foreground">Participants</span>
//             </div>
//             {maxParticipants && (
//               <div
//                 className={`font-medium ${isOverQuota ? "text-destructive" : ""}`}
//               >
//                 {totalParticipants} / {maxParticipants}
//               </div>
//             )}
//           </div>

//           {maxTeams > 0 && (
//             <div className="space-y-1">
//               <div className="flex items-center gap-2">
//                 <Trophy className="h-4 w-4 text-muted-foreground" />
//                 <span className="text-muted-foreground">Équipes</span>
//               </div>
//               <div
//                 className={`font-medium ${isTeamsOverQuota ? "text-destructive" : ""}`}
//               >
//                 {uniqueTeams} / {maxTeams}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="space-y-1">
//           <div className="flex justify-between text-sm">
//             <span className="text-muted-foreground">Validés</span>
//             <span className="font-medium">
//               {validatedParticipants} / {totalParticipants}
//             </span>
//           </div>
//           <div className="w-full bg-secondary rounded-full h-2">
//             <div
//               className="bg-primary rounded-full h-2 transition-all"
//               style={{
//                 width: `${totalParticipants > 0 ? (validatedParticipants / totalParticipants) * 100 : 0}%`,
//               }}
//             />
//           </div>
//         </div>

//         <Separator />

//         <div className="overflow-y-auto">
//           <ParticipantDataTable
//             data={participants}
//             schoolName={schoolName}
//             onValidateParticipant={onValidateParticipant}
//             isLoading={isLoading}
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
