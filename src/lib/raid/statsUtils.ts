import { getSituationLabel } from "./teamUtils";

import { RaidTeamPreview } from "@/api";

export interface Stats {
  difficultyData: { value: number; label: string }[];
  meetingPlaceData: { value: number; label: string }[];
  bikeSizeData: { value: number; label: string }[];
  tShirtSizeData: { value: number; label: string }[];
  situationData: { value: number; label: string }[];
}

export function getStats(seeAll: boolean, teams?: RaidTeamPreview[]): Stats {
  const filteredTeams = teams?.filter(
    (team) => team.validation_progress === 100 || seeAll,
  );
  const difficultyData = getDifficultyData(seeAll, filteredTeams);
  const meetingPlaceData = getMeetingPlaceData(seeAll, filteredTeams);
  const bikeSizeData = getBikeSizeData(seeAll, filteredTeams);
  const tShirtSizeData = getTShirtSizeData(seeAll, filteredTeams);
  const situationData = getSituationData(seeAll, filteredTeams);
  return {
    difficultyData,
    meetingPlaceData,
    bikeSizeData,
    tShirtSizeData,
    situationData,
  };
}

function getDifficultyData(
  seeAll: boolean,
  teams?: RaidTeamPreview[],
): { value: number; label: string }[] {
  const response = [
    { value: 0, label: "Découverte" },
    { value: 0, label: "Sportif" },
    { value: 0, label: "Expert" },
  ];
  if (seeAll) {
    response.push({ value: 0, label: "Non renseigné" });
  }

  if (!teams) {
    return response;
  }
  teams.forEach((team) => {
    if (team.difficulty === "discovery") {
      response[0].value++;
    } else if (team.difficulty === "sports") {
      response[1].value++;
    } else if (team.difficulty === "expert") {
      response[2].value++;
    } else if (seeAll) {
      response[3].value++;
    }
  });
  return response;
}

function getMeetingPlaceData(
  seeAll: boolean,
  teams?: RaidTeamPreview[],
): { value: number; label: string }[] {
  const response = [
    { value: 0, label: "Centrale Lyon" },
    { value: 0, label: "Bellecour" },
    { value: 0, label: "Peu importe" },
  ];
  if (seeAll) {
    response.push({ value: 0, label: "Non renseigné" });
  }
  if (!teams) {
    return response;
  }
  teams.forEach((team) => {
    switch (team.meeting_place) {
      case "centrale":
        response[0].value++;
        break;
      case "bellecour":
        response[1].value++;
        break;
      case "anyway":
        response[2].value++;
        break;
      default:
        if (seeAll) {
          response[3].value++;
        }
        break;
    }
  });
  return response;
}

function getBikeSizeData(
  seeAll: boolean,
  teams?: RaidTeamPreview[],
): { value: number; label: string }[] {
  const response = [
    { value: 0, label: "XS" },
    { value: 0, label: "S" },
    { value: 0, label: "M" },
    { value: 0, label: "L" },
    { value: 0, label: "XL" },
  ];
  if (seeAll) {
    response.push({ value: 0, label: "N/A" });
  }
  if (!teams) {
    return response;
  }
  teams
    .map((team) => [team.captain, team.second])
    .flat(1)
    .forEach((participant) => {
      if (participant) {
        switch (participant.bike_size) {
          case "XS":
            response[0].value++;
            break;
          case "S":
            response[1].value++;
            break;
          case "M":
            response[2].value++;
            break;
          case "L":
            response[3].value++;
            break;
          case "XL":
            response[4].value++;
            break;
          default:
            if (seeAll) {
              response[5].value++;
            }
            break;
        }
      }
    });
  return response;
}

function getTShirtSizeData(
  seeAll: boolean,
  teams?: RaidTeamPreview[],
): { value: number; label: string }[] {
  const response = [
    { value: 0, label: "XS" },
    { value: 0, label: "S" },
    { value: 0, label: "M" },
    { value: 0, label: "L" },
    { value: 0, label: "XL" },
    { value: 0, label: "Non" },
  ];
  if (!teams) {
    return response;
  }
  teams
    .map((team) => [team.captain, team.second])
    .flat(1)
    .forEach((participant) => {
      if (participant) {
        switch (participant.t_shirt_size) {
          case "XS":
            response[0].value++;
            break;
          case "S":
            response[1].value++;
            break;
          case "M":
            response[2].value++;
            break;
          case "L":
            response[3].value++;
            break;
          case "XL":
            response[4].value++;
            break;
          default:
            response[5].value++;
            break;
        }
      }
    });
  return response;
}

function getSituationData(
  seeAll: boolean,
  teams?: RaidTeamPreview[],
): { value: number; label: string }[] {
  const response = [
    { value: 0, label: "Centrale Lyon" },
    { value: 0, label: "Autre école" },
    { value: 0, label: "Partenaire" },
    { value: 0, label: "Autre" },
  ];
  if (seeAll) {
    response.push({ value: 0, label: "N/A" });
  }
  if (!teams) {
    return response;
  }
  teams
    .map((team) => [team.captain, team.second])
    .flat(1)
    .forEach((participant) => {
      if (participant) {
        switch (getSituationLabel(participant.situation ?? undefined)) {
          case "centrale":
            response[0].value++;
            break;
          case "otherschool":
            response[1].value++;
            break;
          case "corporatepartner":
            response[2].value++;
            break;
          case "other":
            response[3].value++;
            break;
          default:
            if (seeAll) {
              response[4].value++;
            }
            break;
        }
      }
    });
  return response;
}
