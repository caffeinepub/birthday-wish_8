import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BirthdayProfile, Wish } from "../backend.d";
import { useActor } from "./useActor";

const DEFAULT_PROFILE: BirthdayProfile = {
  recipientName: "Alex",
  senderName: "Your Loved Ones",
  birthdayDate: new Date().toISOString().split("T")[0],
  heroMessage: "Wishing you a day as bright and beautiful as you are! 🎂",
  personalNote:
    "Wishing you all the happiness in the world on your special day!",
  giftBoxColor: "#60a5fa",
  ribbonColor: "#fbbf24",
  bowStyle: "classic",
  surpriseMessage: "You are loved more than words can say! 🎉",
  backgroundTheme: "light-blue",
};

export function useBirthdayProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<BirthdayProfile>({
    queryKey: ["birthdayProfile"],
    queryFn: async () => {
      if (!actor) return DEFAULT_PROFILE;
      try {
        const profile = await actor.getBirthdayProfile();
        if (!profile.recipientName) return DEFAULT_PROFILE;
        return profile;
      } catch {
        return DEFAULT_PROFILE;
      }
    },
    enabled: !isFetching,
    staleTime: 30000,
  });
}

export function useSetBirthdayProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: BirthdayProfile) => {
      if (!actor) return;
      await actor.setBirthdayProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["birthdayProfile"] });
    },
  });
}

export function useWishes() {
  const { actor, isFetching } = useActor();
  return useQuery<Wish[]>({
    queryKey: ["wishes"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllWishes();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 10000,
  });
}

export function useAddWish() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      visitorName,
      wishText,
    }: { visitorName: string; wishText: string }) => {
      if (!actor) return;
      await actor.addWish(visitorName, wishText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
  });
}

export { DEFAULT_PROFILE };
