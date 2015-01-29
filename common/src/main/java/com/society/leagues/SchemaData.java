package com.society.leagues;

import com.society.leagues.client.api.domain.Role;
import com.society.leagues.client.api.domain.*;
import com.society.leagues.client.api.domain.division.Division;
import com.society.leagues.client.api.domain.division.DivisionType;
import com.society.leagues.client.api.domain.division.LeagueType;
import com.society.leagues.dao.admin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class SchemaData {

    public static boolean generated = false;
    private static Logger logger = LoggerFactory.getLogger(SchemaData.class);
    private String[] CHALLENGE_USERS = new String[] {
            "Doug_C", "Jeff_T", "Rob_P", "Doug_R", "Jared_P", 
            "Howie_L", "Ken_S", "Alex_K", "Roger_P", "Saj_S", 
            "Sofia_C", "Zack_Z", "Earl_S", "Efren_R", "John_S"
    };
    public static List<User> challengeUsers = new ArrayList<>();

    Handicap[] eighthandicap = new Handicap[]{
            Handicap.TWO,
            Handicap.THREE,Handicap.THREE,Handicap.THREE,
            Handicap.FOUR,Handicap.FOUR,Handicap.FOUR,
            Handicap.FIVE,Handicap.FIVE,Handicap.FIVE,
            Handicap.SIX,Handicap.SIX,Handicap.FIVE,
            Handicap.SEVEN,Handicap.SEVEN};

    Handicap[] ninehandicap = new Handicap[]{
            Handicap.D,Handicap.D,
            Handicap.DPLUS,Handicap.DPLUS,Handicap.DPLUS,
            Handicap.C,Handicap.C,
            Handicap.CPLUS,Handicap.CPLUS,
            Handicap.B,Handicap.B,
            Handicap.BPLUS,Handicap.BPLUS,
            Handicap.A,Handicap.PRO};


    @Autowired SeasonAdminDao seasonApi;
    @Autowired DivisionAdminDao divisionApi;
    @Autowired TeamAdminDao teamApi;
    @Autowired PlayerAdminDao playerApi;
    @Autowired UserAdminDao userApi;
    @Autowired MatchAdminDao matchAdminApi;

    public void generateData() {
        if (generated)
            return;
        
        logger.info("***** generating data *****");

        Division eightBallChallenge = new Division(DivisionType.EIGHT_BALL_CHALLENGE, LeagueType.INDIVIDUAL);
        eightBallChallenge = divisionApi.create(eightBallChallenge);
        if (eightBallChallenge == null)
            throw new RuntimeException("Could not create 8ball Challenge Division");
        
        Division nineBallChallenge = new Division(DivisionType.NINE_BALL_CHALLENGE, LeagueType.INDIVIDUAL);
        nineBallChallenge = divisionApi.create(nineBallChallenge);
        if (nineBallChallenge == null)
            throw new RuntimeException("Could not create 8ball Challenge Division");

        Season challengeSeason = new Season("Challenge League", new Date(), -1);
        challengeSeason.setSeasonStatus(Status.ACTIVE);
        challengeSeason = seasonApi.create(challengeSeason);
        
        if (challengeSeason == null)
            throw new RuntimeException("Could not Challenge Season");

        logger.info("Creating 8ball challenge players");
        createPlayerForSeason(challengeSeason,eightBallChallenge);
        logger.info("Creating 9ball challenge players");
        createPlayerForSeason(challengeSeason,nineBallChallenge);

        Match match = new Match();
        User u1 = challengeUsers.get(0);
        User u2 = challengeUsers.get(1);
        Player p  = u1.getPlayers().stream().filter(pl -> pl.getDivision().getType() == DivisionType.EIGHT_BALL_CHALLENGE).findFirst().get();
        match.setHome(p.getTeam());
        p = u2.getPlayers().stream().filter(tm -> tm.getDivision().getType() == DivisionType.EIGHT_BALL_CHALLENGE).findFirst().get();
        match.setAway(p.getTeam());
        match.setMatchDate(new Date());
        match.setSeason(p.getSeason());
        matchAdminApi.create(match);

        generated = true;
        
    }
    
    private void createPlayerForSeason(Season season, Division division) {
        for (int i = 0; i < CHALLENGE_USERS.length; i++) {
            String user = CHALLENGE_USERS[i];
            String[] name = user.split("_");
            User u = userApi.get(user);
            if (u == null) {
                logger.info("Calling create user: " + user);
                u = userApi.create(new User(name[0], name[1], user, user, Role.PLAYER));
                
                if (u == null)
                    throw new RuntimeException("Could not create or verify user: " + user);
                
                challengeUsers.add(u);
            }
            Team team = new Team(user);
            Team t = teamApi.get(user);
            if (t == null)
                t = teamApi.create(team);
            
            team = t;

            Player player = new Player();
            switch (division.getType()) {
                case EIGHT_BALL_MIXED_MONDAYS:
                case EIGHT_BALL_CHALLENGE:
                case EIGHT_BALL_THURSDAYS:
                case EIGHT_BALL_WEDNESDAYS:
                    player.setHandicap(eighthandicap[i]);
                    break;
                default:
                    player.setHandicap(ninehandicap[i]);
                    break;
            }
            player.setUser(u);
            player.setTeam(team);
            player.setStatus(Status.ACTIVE);
            player.setSeason(season);
            player.setDivision(division);
            u.addPlayer(playerApi.create(player));
        }

    }
}
