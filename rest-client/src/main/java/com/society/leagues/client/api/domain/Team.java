package com.society.leagues.client.api.domain;

import com.society.leagues.client.api.domain.division.Division;

import javax.validation.constraints.NotNull;
import java.util.Date;

public class Team extends LeagueObject {
    @NotNull
    String name;
    @NotNull
    Division defaultDivision;
    Date created;

    public Team(String name, Division division) {
        this.name = name;
        this.defaultDivision = division;
    }

    public Team() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Division getDefaultDivision() {
        return defaultDivision;
    }

    public void setDefaultDivision(Division defaultDivision) {
        this.defaultDivision = defaultDivision;
    }

    @Override
    public String toString() {
        return "Team{" +
                "name='" + name + '\'' +
                ", id=" + id +
                '}';
    }
}
