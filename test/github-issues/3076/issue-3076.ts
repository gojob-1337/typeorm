import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils";
import { Connection } from "../../../src/connection/Connection";
import { Playlist } from "./entity/Playlist";
import { expect } from "chai";


describe("github issues > #3076 migration:generate continuously updates default values", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Playlist],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should NOT generate change queries in case default values are not changed", () => Promise.all(connections.map(async function (connection) {

        await connection.synchronize(true);

        const sqlInMemory = await connection.driver.createSchemaBuilder().log();

        expect(sqlInMemory.downQueries).to.be.empty;
        expect(sqlInMemory.upQueries).to.be.empty;
    })));

});
