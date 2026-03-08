import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  type BirthdayProfile = {
    recipientName : Text;
    senderName : Text;
    birthdayDate : Text;
    personalNote : Text;
    giftBoxColor : Text;
    ribbonColor : Text;
    bowStyle : Text;
    surpriseMessage : Text;
    backgroundTheme : Text;
  };

  type Wish = {
    visitorName : Text;
    wishText : Text;
    timestamp : Int;
  };

  module Wish {
    public func compare(wish1 : Wish, wish2 : Wish) : Order.Order {
      Int.compare(wish1.timestamp, wish2.timestamp);
    };
  };

  var birthdayProfile : ?BirthdayProfile = null;

  let wishes = Map.empty<Nat, Wish>();
  var wishCounter = 0;

  public shared ({ caller }) func setBirthdayProfile(profile : BirthdayProfile) : async () {
    birthdayProfile := ?profile;
  };

  public query ({ caller }) func getBirthdayProfile() : async BirthdayProfile {
    switch (birthdayProfile) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Birthday profile not set") };
    };
  };

  public shared ({ caller }) func addWish(visitorName : Text, wishText : Text) : async () {
    let wish : Wish = {
      visitorName;
      wishText;
      timestamp = Time.now();
    };

    wishes.add(wishCounter, wish);
    wishCounter += 1;
  };

  public query ({ caller }) func getAllWishes() : async [Wish] {
    wishes.values().toArray().sort();
  };

  public shared ({ caller }) func clearWishes() : async () {
    wishes.clear();
    wishCounter := 0;
  };
};
